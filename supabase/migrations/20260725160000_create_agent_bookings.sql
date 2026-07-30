-- Agent Bookings: free-form phone bookings from ElevenLabs voice agent (no payment required)
CREATE TABLE IF NOT EXISTS public.agent_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'new',
  source text NOT NULL DEFAULT 'phone_agent',
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  service_type text,
  zip_code text,
  service_address text,
  preferred_date text,
  preferred_time_window text,
  quoted_price_summary text,
  call_summary text,
  conversation_id text,
  agent_id text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  raw_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT agent_bookings_status_check CHECK (status IN ('new', 'reviewed', 'confirmed', 'cancelled', 'converted')),
  CONSTRAINT agent_bookings_name_not_blank CHECK (length(trim(customer_name)) > 0),
  CONSTRAINT agent_bookings_phone_not_blank CHECK (length(trim(customer_phone)) > 0)
);

COMMENT ON TABLE public.agent_bookings IS 'Phone bookings captured by the ElevenLabs voice agent (Macy). Free-form vs website bookings; no payment required.';
COMMENT ON COLUMN public.agent_bookings.details IS 'Flexible JSON for service-specific info (junk items, moving options, notes, etc.).';
COMMENT ON COLUMN public.agent_bookings.raw_payload IS 'Full webhook payload from the agent tool for audit/debug.';

CREATE INDEX IF NOT EXISTS agent_bookings_created_at_idx ON public.agent_bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS agent_bookings_status_idx ON public.agent_bookings (status);
CREATE INDEX IF NOT EXISTS agent_bookings_customer_phone_idx ON public.agent_bookings (customer_phone);
CREATE INDEX IF NOT EXISTS agent_bookings_service_type_idx ON public.agent_bookings (service_type);

ALTER TABLE public.agent_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY agent_bookings_authenticated_select
  ON public.agent_bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY agent_bookings_authenticated_update
  ON public.agent_bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.set_agent_bookings_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS agent_bookings_set_updated_at ON public.agent_bookings;
CREATE TRIGGER agent_bookings_set_updated_at
  BEFORE UPDATE ON public.agent_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_agent_bookings_updated_at();
