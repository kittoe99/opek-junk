import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { getSupabaseAdmin, isSupabaseAdminConfigured } from '../lib/supabaseAdmin';

export const config = {
  api: {
    bodyParser: false,
  },
};

function readRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer | string) => {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function isEventProcessed(supabase: ReturnType<typeof getSupabaseAdmin>, eventId: string) {
  const { data } = await supabase
    .from('stripe_webhook_events')
    .select('stripe_event_id')
    .eq('stripe_event_id', eventId)
    .maybeSingle();

  return Boolean(data);
}

async function markEventProcessed(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  eventId: string,
  eventType: string
) {
  const { error } = await supabase.from('stripe_webhook_events').insert({
    stripe_event_id: eventId,
    event_type: eventType,
  });

  if (error && error.code !== '23505') {
    throw error;
  }
}

async function upsertPaymentFromIntent(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  paymentIntent: Stripe.PaymentIntent
) {
  const chargeId =
    typeof paymentIntent.latest_charge === 'string'
      ? paymentIntent.latest_charge
      : paymentIntent.latest_charge?.id ?? null;

  const customerEmail =
    paymentIntent.receipt_email ??
    (typeof paymentIntent.metadata?.customer_email === 'string'
      ? paymentIntent.metadata.customer_email
      : null);

  const paymentRow = {
    stripe_payment_intent_id: paymentIntent.id,
    stripe_charge_id: chargeId,
    amount_cents: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: paymentIntent.status,
    payment_type: paymentIntent.metadata?.type ?? 'booking_deposit',
    service_type: paymentIntent.metadata?.service_type ?? null,
    customer_email: customerEmail,
    metadata: paymentIntent.metadata ?? {},
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('payments')
    .upsert(paymentRow, { onConflict: 'stripe_payment_intent_id' });

  if (error) {
    throw error;
  }

  const { data: booking } = await supabase
    .from('bookings')
    .select('id')
    .filter('booking_details->>stripe_payment_intent_id', 'eq', paymentIntent.id)
    .maybeSingle();

  if (booking?.id) {
    await supabase
      .from('payments')
      .update({ booking_id: booking.id, updated_at: new Date().toISOString() })
      .eq('stripe_payment_intent_id', paymentIntent.id)
      .is('booking_id', null);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!secretKey) {
    return res.status(500).json({ error: 'Stripe secret key is not configured.' });
  }

  if (!webhookSecret) {
    return res.status(500).json({ error: 'Stripe webhook secret is not configured.' });
  }

  if (!isSupabaseAdminConfigured()) {
    return res.status(500).json({ error: 'Supabase service role key is not configured.' });
  }

  const signature = req.headers['stripe-signature'];
  if (!signature || Array.isArray(signature)) {
    return res.status(400).json({ error: 'Missing Stripe signature header.' });
  }

  const stripe = new Stripe(secretKey);
  const supabase = getSupabaseAdmin();

  let event: Stripe.Event;

  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid webhook signature';
    console.error('Stripe webhook signature verification failed:', message);
    return res.status(400).json({ error: message });
  }

  try {
    if (await isEventProcessed(supabase, event.id)) {
      return res.status(200).json({ received: true, duplicate: true });
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
      case 'payment_intent.payment_failed':
      case 'payment_intent.canceled':
      case 'payment_intent.processing':
      case 'payment_intent.requires_action':
        await upsertPaymentFromIntent(supabase, event.data.object as Stripe.PaymentIntent);
        break;
      default:
        break;
    }

    await markEventProcessed(supabase, event.id, event.type);

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Stripe webhook handler error:', error);
    const message = error instanceof Error ? error.message : 'Webhook handler failed';
    return res.status(500).json({ error: message });
  }
}
