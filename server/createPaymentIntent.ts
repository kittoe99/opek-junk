import Stripe from 'stripe';
import { upsertStripeCustomer } from './stripeCustomerStore.js';
import {
  ensureStripeCustomer,
  normalizeStripeCustomerContact,
  type StripeCustomerContact,
} from './stripeCustomer.js';
import { ClientError } from './httpErrors.js';
import { getSupabaseAdmin, isSupabaseAdminConfigured } from './supabaseAdmin.js';

export const BOOKING_DEPOSIT_AMOUNT_CENTS = 100;

export interface CreatePaymentIntentOptions extends StripeCustomerContact {
  serviceType?: string;
}

async function resolveStripeCustomer(
  stripe: Stripe,
  options: CreatePaymentIntentOptions
): Promise<Stripe.Customer> {
  // The customer is always resolved from the submitted contact details; a
  // client-supplied Stripe customer ID is never trusted.
  const normalized = normalizeStripeCustomerContact(options);
  if (!normalized.email) {
    throw new ClientError('A valid email is required before payment can be initialized.');
  }

  const { stripeCustomer } = await ensureStripeCustomer(stripe, options);
  return stripeCustomer;
}

async function persistPaymentRecord(
  paymentIntent: Stripe.PaymentIntent,
  stripeCustomer: Stripe.Customer,
  contact: ReturnType<typeof normalizeStripeCustomerContact>,
  serviceType?: string
) {
  if (!isSupabaseAdminConfigured()) {
    return;
  }

  const supabase = getSupabaseAdmin();
  const customerRow = await upsertStripeCustomer(supabase, {
    stripeCustomerId: stripeCustomer.id,
    email: stripeCustomer.email ?? contact.email ?? null,
    name: stripeCustomer.name ?? contact.name ?? null,
    phone: stripeCustomer.phone ?? contact.phone ?? null,
    metadata: (stripeCustomer.metadata ?? {}) as Record<string, string>,
  });

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
      service_type: serviceType ?? paymentIntent.metadata?.service_type ?? null,
      customer_email: contact.email ?? paymentIntent.receipt_email ?? null,
      customer_id: customerRow.id,
      metadata: paymentIntent.metadata ?? {},
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'stripe_payment_intent_id' }
  );

  if (paymentError) {
    throw paymentError;
  }
}

export async function createBookingPaymentIntent(
  secretKey: string,
  options: CreatePaymentIntentOptions = {}
) {
  const stripe = new Stripe(secretKey);
  const { serviceType } = options;
  const contact = normalizeStripeCustomerContact(options);

  const stripeCustomer = await resolveStripeCustomer(stripe, options);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: BOOKING_DEPOSIT_AMOUNT_CENTS,
    currency: 'usd',
    payment_method_types: ['card'],
    customer: stripeCustomer.id,
    setup_future_usage: 'off_session',
    metadata: {
      type: 'booking_deposit',
      service_type: typeof serviceType === 'string' ? serviceType : 'booking',
      stripe_customer_id: stripeCustomer.id,
      ...(contact.email ? { customer_email: contact.email } : {}),
      ...(contact.name ? { customer_name: contact.name } : {}),
      ...(contact.phone ? { customer_phone: contact.phone } : {}),
    },
    ...(contact.email ? { receipt_email: contact.email } : {}),
  });

  if (!paymentIntent.client_secret) {
    throw new Error('Failed to initialize payment.');
  }

  try {
    await persistPaymentRecord(paymentIntent, stripeCustomer, contact, serviceType);
  } catch (dbError) {
    console.error('Failed to persist payment to Supabase:', dbError);
  }

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    stripeCustomerId: stripeCustomer.id,
    customerEmail: contact.email ?? null,
    customerName: contact.name ?? null,
    customerPhone: contact.phone ?? null,
  };
}
