import Stripe from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseAdmin, isSupabaseAdminConfigured } from './supabaseAdmin.js';
import {
  resolveStripeCustomerForIntent,
  saveCustomerPaymentMethod,
  upsertPaymentFromIntent,
} from './stripeDb.js';

export interface SyncPaymentIntentResult {
  paymentIntentId: string;
  stripeCustomerId: string | null;
  paymentMethodId: string | null;
  defaultPaymentMethodSet: boolean;
}

export async function syncSucceededPaymentIntent(
  stripe: Stripe,
  paymentIntentId: string,
  supabase?: SupabaseClient | null
): Promise<SyncPaymentIntentResult> {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ['payment_method', 'customer'],
  });

  if (paymentIntent.status !== 'succeeded') {
    throw new Error('Payment has not succeeded yet.');
  }

  const db = supabase ?? (isSupabaseAdminConfigured() ? getSupabaseAdmin() : null);
  let customerId: string | null = null;

  if (db) {
    customerId = await resolveStripeCustomerForIntent(stripe, db, paymentIntent);
    await upsertPaymentFromIntent(db, paymentIntent, customerId);
  }

  await saveCustomerPaymentMethod(stripe, paymentIntent, db);

  const stripeCustomerId =
    typeof paymentIntent.customer === 'string'
      ? paymentIntent.customer
      : paymentIntent.customer?.id ?? null;

  const paymentMethodId =
    typeof paymentIntent.payment_method === 'string'
      ? paymentIntent.payment_method
      : paymentIntent.payment_method?.id ?? null;

  let defaultPaymentMethodSet = false;
  if (stripeCustomerId) {
    const customer = await stripe.customers.retrieve(stripeCustomerId);
    if (!('deleted' in customer && customer.deleted)) {
      defaultPaymentMethodSet =
        (customer as Stripe.Customer).invoice_settings?.default_payment_method === paymentMethodId;
    }
  }

  return {
    paymentIntentId: paymentIntent.id,
    stripeCustomerId,
    paymentMethodId,
    defaultPaymentMethodSet,
  };
}
