-- Migration: Stripe payments tracking for booking deposits

CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_payment_intent_id TEXT NOT NULL UNIQUE,
    stripe_charge_id TEXT,
    amount_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    status TEXT NOT NULL,
    payment_type TEXT NOT NULL DEFAULT 'booking_deposit',
    service_type TEXT,
    customer_email TEXT,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX payments_booking_id_idx ON public.payments (booking_id);
CREATE INDEX payments_status_idx ON public.payments (status);
CREATE INDEX payments_created_at_idx ON public.payments (created_at DESC);

CREATE TABLE public.stripe_webhook_events (
    stripe_event_id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read for payments"
    ON public.payments FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Deny client access to webhook events"
    ON public.stripe_webhook_events FOR SELECT
    USING (false);

CREATE OR REPLACE FUNCTION public.link_payment_to_booking()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.payments
    SET booking_id = NEW.id,
        updated_at = now()
    WHERE stripe_payment_intent_id = NEW.booking_details->>'stripe_payment_intent_id'
      AND booking_id IS NULL;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER link_payment_on_booking_insert
    AFTER INSERT ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.link_payment_to_booking();
