-- Stripe customer records synced from Stripe Customer objects

CREATE TABLE public.stripe_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_customer_id TEXT NOT NULL UNIQUE,
    email TEXT,
    name TEXT,
    phone TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX stripe_customers_email_idx ON public.stripe_customers (lower(email))
    WHERE email IS NOT NULL;
CREATE INDEX stripe_customers_phone_idx ON public.stripe_customers (phone)
    WHERE phone IS NOT NULL;

ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read for stripe customers"
    ON public.stripe_customers FOR SELECT
    USING (auth.role() = 'authenticated');

REVOKE SELECT ON public.stripe_customers FROM anon;

ALTER TABLE public.payments
    ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.stripe_customers(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS payments_customer_id_idx ON public.payments (customer_id);
