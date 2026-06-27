import type Stripe from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';
import { upsertStripeCustomer } from './stripeCustomerStore.js';
import { getSupabaseAdmin, isSupabaseAdminConfigured } from './supabaseAdmin.js';

export interface StripeCustomerContact {
  email?: string;
  name?: string;
  phone?: string;
}

export interface NormalizedStripeCustomerContact {
  email?: string;
  name?: string;
  phone?: string;
  stripePhone?: string;
}

export function normalizePhoneForStripe(phone?: string): string | undefined {
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

export function normalizeStripeCustomerContact(
  contact: StripeCustomerContact
): NormalizedStripeCustomerContact {
  const email =
    typeof contact.email === 'string' && contact.email.includes('@')
      ? contact.email.trim().toLowerCase()
      : undefined;
  const name = typeof contact.name === 'string' ? contact.name.trim() : undefined;
  const phone = typeof contact.phone === 'string' ? contact.phone.trim() : undefined;
  const stripePhone = normalizePhoneForStripe(contact.phone);

  return { email, name, phone, stripePhone };
}

export function hasStripeCustomerIdentity(contact: NormalizedStripeCustomerContact): boolean {
  return Boolean(contact.email || contact.name || contact.stripePhone || contact.phone);
}

function customerIdempotencyKey(email: string): string {
  const safe = email.toLowerCase().replace(/[^a-z0-9]/gi, '_').slice(0, 200);
  return `customer_email_${safe}`;
}

export async function findOrCreateStripeCustomer(
  stripe: Stripe,
  contact: StripeCustomerContact
): Promise<Stripe.Customer> {
  const normalized = normalizeStripeCustomerContact(contact);

  if (!hasStripeCustomerIdentity(normalized)) {
    throw new Error('Customer contact details are required before payment.');
  }

  if (normalized.email) {
    const existing = await stripe.customers.list({ email: normalized.email, limit: 1 });
    if (existing.data[0]) {
      const current = existing.data[0];
      const updates: Stripe.CustomerUpdateParams = {};

      if (normalized.name && normalized.name !== current.name) {
        updates.name = normalized.name;
      }
      if (normalized.stripePhone && normalized.stripePhone !== current.phone) {
        updates.phone = normalized.stripePhone;
      }

      if (Object.keys(updates).length > 0) {
        return stripe.customers.update(current.id, updates);
      }

      return current;
    }

    return stripe.customers.create(
      {
        email: normalized.email,
        name: normalized.name,
        phone: normalized.stripePhone,
        metadata: { source: 'opekjunkremoval.com' },
      },
      { idempotencyKey: customerIdempotencyKey(normalized.email) }
    );
  }

  return stripe.customers.create({
    name: normalized.name,
    phone: normalized.stripePhone,
    metadata: { source: 'opekjunkremoval.com' },
  });
}

export async function persistStripeCustomerRecord(
  supabase: SupabaseClient,
  stripeCustomer: Stripe.Customer
) {
  return upsertStripeCustomer(supabase, {
    stripeCustomerId: stripeCustomer.id,
    email: stripeCustomer.email,
    name: stripeCustomer.name,
    phone: stripeCustomer.phone,
    metadata: (stripeCustomer.metadata ?? {}) as Record<string, string>,
  });
}

export async function ensureStripeCustomer(
  stripe: Stripe,
  contact: StripeCustomerContact
): Promise<{
  stripeCustomer: Stripe.Customer;
  stripeCustomerId: string;
  supabaseCustomerId: string | null;
}> {
  const stripeCustomer = await findOrCreateStripeCustomer(stripe, contact);
  let supabaseCustomerId: string | null = null;

  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdmin();
    const record = await persistStripeCustomerRecord(supabase, stripeCustomer);
    supabaseCustomerId = record.id;
  }

  return {
    stripeCustomer,
    stripeCustomerId: stripeCustomer.id,
    supabaseCustomerId,
  };
}
