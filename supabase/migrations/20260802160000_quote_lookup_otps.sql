-- Quote lookup OTP codes for continue-from-quote on /booking.
-- Accessed only by the lookup-quote-otp edge function (service role).

CREATE TABLE IF NOT EXISTS public.quote_lookup_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_digits TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS quote_lookup_otps_phone_created_idx
  ON public.quote_lookup_otps (phone_digits, created_at DESC);

CREATE INDEX IF NOT EXISTS quote_lookup_otps_expires_idx
  ON public.quote_lookup_otps (expires_at);

ALTER TABLE public.quote_lookup_otps ENABLE ROW LEVEL SECURITY;

-- Deny all client access; edge function uses service role.
CREATE POLICY "Deny all client access to quote_lookup_otps"
  ON public.quote_lookup_otps
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

REVOKE ALL ON TABLE public.quote_lookup_otps FROM anon, authenticated;
GRANT ALL ON TABLE public.quote_lookup_otps TO service_role;
