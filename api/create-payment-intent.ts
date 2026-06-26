import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const BOOKING_DEPOSIT_AMOUNT_CENTS = 100;

function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured.');
  }

  const rawUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const supabaseUrl =
    rawUrl && rawUrl !== 'your_supabase_url_here'
      ? rawUrl
      : 'https://mjgwoukwyqwoectxfwqv.supabase.co';

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function persistPaymentRecord(
  paymentIntent: Stripe.PaymentIntent,
  stripeCustomerId: string | undefined,
  customer: {
    email?: string;
    name?: string;
    phone?: string;
  }
) {
  const supabase = getSupabaseAdmin();
  let customerId: string | null = null;

  if (stripeCustomerId) {
    const { data: customerRow, error: customerError } = await supabase
      .from('stripe_customers')
      .upsert(
        {
          stripe_customer_id: stripeCustomerId,
          email: customer.email ?? null,
          name: customer.name ?? null,
          phone: customer.phone ?? null,
          metadata: { source: 'opekjunkremoval.com' },
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'stripe_customer_id' }
      )
      .select('id')
      .single();

    if (customerError) {
      throw customerError;
    }

    customerId = customerRow.id;
  }

  const { error: paymentError } = await supabase.from('payments').upsert(
    {
      stripe_payment_intent_id: paymentIntent.id,
      stripe_charge_id:
        typeof paymentIntent.latest_charge === 'string'
          ? paymentIntent.latest_charge
          : paymentIntent.latest_charge?.id ?? null,
      amount_cents: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      payment_type: paymentIntent.metadata?.type ?? 'booking_deposit',
      service_type: paymentIntent.metadata?.service_type ?? null,
      customer_email: customer.email ?? paymentIntent.receipt_email ?? null,
      customer_id: customerId,
      metadata: paymentIntent.metadata ?? {},
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'stripe_payment_intent_id' }
  );

  if (paymentError) {
    throw paymentError;
  }
}

function normalizePhoneForStripe(phone?: string): string | undefined {
  if (typeof phone !== 'string') {
    return undefined;
  }

  const trimmed = phone.trim();
  if (!trimmed) {
    return undefined;
  }

  if (trimmed.startsWith('+')) {
    const digits = trimmed.slice(1).replace(/\D/g, '');
    return digits.length >= 10 ? `+${digits}` : undefined;
  }

  const digits = trimmed.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }

  return undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    return res.status(500).json({
      error: 'Stripe is not configured. Add STRIPE_SECRET_KEY in Vercel project settings.',
    });
  }

  if (!/^sk_(test|live)_/.test(secretKey)) {
    return res.status(500).json({
      error:
        'STRIPE_SECRET_KEY is invalid. It must be your Stripe secret key starting with sk_test_ or sk_live_, not the variable name or publishable key.',
    });
  }

  const stripe = new Stripe(secretKey);

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
    const { email, name, phone, serviceType } = body;

    const normalizedEmail =
      typeof email === 'string' && email.includes('@') ? email.trim() : undefined;
    const normalizedName = typeof name === 'string' ? name.trim() : undefined;
    const normalizedPhone = typeof phone === 'string' ? phone.trim() : undefined;
    const stripePhone = normalizePhoneForStripe(phone);

    let stripeCustomerId: string | undefined;
    if (normalizedEmail || normalizedName || stripePhone) {
      if (normalizedEmail) {
        const existing = await stripe.customers.list({ email: normalizedEmail, limit: 1 });
        stripeCustomerId = existing.data[0]?.id;
      }

      if (!stripeCustomerId) {
        const created = await stripe.customers.create({
          email: normalizedEmail,
          name: normalizedName,
          phone: stripePhone,
          metadata: { source: 'opekjunkremoval.com' },
        });
        stripeCustomerId = created.id;
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: BOOKING_DEPOSIT_AMOUNT_CENTS,
      currency: 'usd',
      payment_method_types: ['card'],
      ...(stripeCustomerId ? { customer: stripeCustomerId } : {}),
      metadata: {
        type: 'booking_deposit',
        service_type: typeof serviceType === 'string' ? serviceType : 'booking',
        ...(normalizedEmail ? { customer_email: normalizedEmail } : {}),
        ...(normalizedName ? { customer_name: normalizedName } : {}),
        ...(normalizedPhone ? { customer_phone: normalizedPhone } : {}),
      },
      ...(normalizedEmail ? { receipt_email: normalizedEmail } : {}),
    });

    if (!paymentIntent.client_secret) {
      return res.status(500).json({ error: 'Failed to initialize payment.' });
    }

    if (process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
      try {
        await persistPaymentRecord(paymentIntent, stripeCustomerId, {
          email: normalizedEmail,
          name: normalizedName,
          phone: normalizedPhone,
        });
      } catch (dbError) {
        console.error('Failed to persist payment to Supabase:', dbError);
      }
    }

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Stripe PaymentIntent error:', error);
    return res.status(500).json({ error: 'Failed to create payment intent. Please try again.' });
  }
}
