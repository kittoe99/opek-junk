import type { SupabaseClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';
import { findOrCreateStripeCustomer } from './stripeCustomer';
import {
  upsertStripeCustomer,
  type StripeCustomerRow,
  type UpsertStripeCustomerInput,
} from './stripeCustomerStore';

export type { StripeCustomerRow, UpsertStripeCustomerInput };
export { upsertStripeCustomer };

export async function upsertPaymentFromIntent(
  supabase: SupabaseClient,
  paymentIntent: Stripe.PaymentIntent,
  customerId?: string | null
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
    customer_id: customerId ?? null,
    metadata: paymentIntent.metadata ?? {},
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('payments')
    .upsert(paymentRow, { onConflict: 'stripe_payment_intent_id' });

  if (error) {
    throw error;
  }

  await linkPaymentToBooking(supabase, paymentIntent.id);
}

export async function linkPaymentToBooking(
  supabase: SupabaseClient,
  paymentIntentId: string
) {
  const { data: booking } = await supabase
    .from('bookings')
    .select('id')
    .filter('booking_details->>stripe_payment_intent_id', 'eq', paymentIntentId)
    .maybeSingle();

  if (booking?.id) {
    await supabase
      .from('payments')
      .update({ booking_id: booking.id, updated_at: new Date().toISOString() })
      .eq('stripe_payment_intent_id', paymentIntentId)
      .is('booking_id', null);
  }
}

export function customerFieldsFromIntent(paymentIntent: Stripe.PaymentIntent) {
  return {
    email:
      paymentIntent.receipt_email ??
      (typeof paymentIntent.metadata?.customer_email === 'string'
        ? paymentIntent.metadata.customer_email
        : null),
    name:
      typeof paymentIntent.metadata?.customer_name === 'string'
        ? paymentIntent.metadata.customer_name
        : null,
    phone:
      typeof paymentIntent.metadata?.customer_phone === 'string'
        ? paymentIntent.metadata.customer_phone
        : null,
  };
}

export async function saveCustomerPaymentMethod(
  stripe: Stripe,
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  if (paymentIntent.status !== 'succeeded') {
    return;
  }

  const stripeCustomerId =
    typeof paymentIntent.customer === 'string'
      ? paymentIntent.customer
      : paymentIntent.customer?.id ?? null;

  const paymentMethodId =
    typeof paymentIntent.payment_method === 'string'
      ? paymentIntent.payment_method
      : paymentIntent.payment_method?.id ?? null;

  if (!stripeCustomerId || !paymentMethodId) {
    return;
  }

  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

  if (!paymentMethod.customer) {
    await stripe.paymentMethods.attach(paymentMethodId, { customer: stripeCustomerId });
  } else if (paymentMethod.customer !== stripeCustomerId) {
    console.warn(
      `Payment method ${paymentMethodId} belongs to ${paymentMethod.customer}, not ${stripeCustomerId}`
    );
    return;
  }

  await stripe.customers.update(stripeCustomerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });
}

export async function resolveStripeCustomerForIntent(
  stripe: Stripe,
  supabase: SupabaseClient,
  paymentIntent: Stripe.PaymentIntent
): Promise<string | null> {
  const stripeCustomerId =
    typeof paymentIntent.customer === 'string'
      ? paymentIntent.customer
      : paymentIntent.customer?.id ?? null;

  if (stripeCustomerId) {
    const retrieved = await stripe.customers.retrieve(stripeCustomerId);
    if ('deleted' in retrieved && retrieved.deleted) {
      return null;
    }

    const stripeCustomer = retrieved as Stripe.Customer;

    const record = await upsertStripeCustomer(supabase, {
      stripeCustomerId: stripeCustomer.id,
      email: stripeCustomer.email ?? null,
      name: stripeCustomer.name ?? null,
      phone: stripeCustomer.phone ?? null,
      metadata: (stripeCustomer.metadata ?? {}) as Record<string, string>,
    });

    return record.id;
  }

  const fields = customerFieldsFromIntent(paymentIntent);
  if (!fields.email && !fields.name && !fields.phone) {
    return null;
  }

  const stripeCustomer = await findOrCreateStripeCustomer(stripe, {
    email: fields.email ?? undefined,
    name: fields.name ?? undefined,
    phone: fields.phone ?? undefined,
  });

  const record = await upsertStripeCustomer(supabase, {
    stripeCustomerId: stripeCustomer.id,
    email: stripeCustomer.email ?? fields.email,
    name: stripeCustomer.name ?? fields.name,
    phone: stripeCustomer.phone ?? fields.phone,
    metadata: (stripeCustomer.metadata ?? {}) as Record<string, string>,
  });

  return record.id;
}
