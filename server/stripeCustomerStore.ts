import type { SupabaseClient } from '@supabase/supabase-js';

export interface StripeCustomerRow {
  id: string;
  stripe_customer_id: string;
}

export interface UpsertStripeCustomerInput {
  stripeCustomerId: string;
  email?: string | null;
  name?: string | null;
  phone?: string | null;
  metadata?: Record<string, string>;
}

export async function upsertStripeCustomer(
  supabase: SupabaseClient,
  input: UpsertStripeCustomerInput
): Promise<StripeCustomerRow> {
  const row = {
    stripe_customer_id: input.stripeCustomerId,
    email: input.email ?? null,
    name: input.name ?? null,
    phone: input.phone ?? null,
    metadata: input.metadata ?? {},
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('stripe_customers')
    .upsert(row, { onConflict: 'stripe_customer_id' })
    .select('id, stripe_customer_id')
    .single();

  if (error) {
    throw error;
  }

  return data;
}
