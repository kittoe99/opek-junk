-- Surface SMS marketing consent on customers + a readable opt-in view.

ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS sms_marketing_consent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS sms_marketing_consent_at timestamptz,
  ADD COLUMN IF NOT EXISTS sms_marketing_consent_text text;

CREATE INDEX IF NOT EXISTS customers_sms_marketing_consent_idx
  ON public.customers (sms_marketing_consent)
  WHERE sms_marketing_consent = true;

CREATE OR REPLACE FUNCTION public.apply_sms_consent_from_json(p_info jsonb)
RETURNS TABLE (
  consent boolean,
  consent_at timestamptz,
  consent_text text
)
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT
    CASE lower(coalesce(p_info->>'sms_marketing_consent', ''))
      WHEN 'true' THEN true
      WHEN 'false' THEN false
      ELSE NULL::boolean
    END AS consent,
    NULLIF(trim(coalesce(p_info->>'sms_marketing_consent_at', '')), '')::timestamptz AS consent_at,
    NULLIF(trim(coalesce(p_info->>'sms_marketing_consent_text', '')), '') AS consent_text;
$$;

CREATE OR REPLACE FUNCTION public.upsert_customer_from_booking_info(
  p_email text,
  p_name text,
  p_phone text,
  p_booking_at timestamptz DEFAULT now(),
  p_sms_marketing_consent boolean DEFAULT NULL,
  p_sms_marketing_consent_at timestamptz DEFAULT NULL,
  p_sms_marketing_consent_text text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
  v_id uuid;
BEGIN
  v_email := lower(trim(coalesce(p_email, '')));
  IF v_email = '' THEN
    RETURN NULL;
  END IF;

  INSERT INTO public.customers (
    email,
    name,
    phone,
    first_booking_at,
    last_booking_at,
    sms_marketing_consent,
    sms_marketing_consent_at,
    sms_marketing_consent_text
  )
  VALUES (
    v_email,
    coalesce(nullif(trim(p_name), ''), ''),
    coalesce(nullif(trim(p_phone), ''), ''),
    p_booking_at,
    p_booking_at,
    coalesce(p_sms_marketing_consent, false),
    p_sms_marketing_consent_at,
    p_sms_marketing_consent_text
  )
  ON CONFLICT (email) DO UPDATE SET
    name = CASE
      WHEN coalesce(nullif(trim(EXCLUDED.name), ''), '') <> '' THEN trim(EXCLUDED.name)
      ELSE public.customers.name
    END,
    phone = CASE
      WHEN coalesce(nullif(trim(EXCLUDED.phone), ''), '') <> '' THEN trim(EXCLUDED.phone)
      ELSE public.customers.phone
    END,
    sms_marketing_consent = CASE
      WHEN EXCLUDED.sms_marketing_consent IS TRUE THEN true
      WHEN p_sms_marketing_consent IS FALSE THEN false
      ELSE public.customers.sms_marketing_consent
    END,
    sms_marketing_consent_at = CASE
      WHEN EXCLUDED.sms_marketing_consent IS TRUE
           AND EXCLUDED.sms_marketing_consent_at IS NOT NULL THEN EXCLUDED.sms_marketing_consent_at
      WHEN p_sms_marketing_consent IS FALSE THEN NULL
      ELSE public.customers.sms_marketing_consent_at
    END,
    sms_marketing_consent_text = CASE
      WHEN EXCLUDED.sms_marketing_consent IS TRUE
           AND EXCLUDED.sms_marketing_consent_text IS NOT NULL THEN EXCLUDED.sms_marketing_consent_text
      WHEN p_sms_marketing_consent IS FALSE THEN NULL
      ELSE public.customers.sms_marketing_consent_text
    END,
    updated_at = now()
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.bookings_sync_customer_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_consent boolean;
  v_consent_at timestamptz;
  v_consent_text text;
BEGIN
  SELECT ac.consent, ac.consent_at, ac.consent_text
  INTO v_consent, v_consent_at, v_consent_text
  FROM public.apply_sms_consent_from_json(NEW.customer_info) ac;

  NEW.customer_id := public.upsert_customer_from_booking_info(
    NEW.customer_info->>'email',
    NEW.customer_info->>'name',
    NEW.customer_info->>'phone',
    coalesce(NEW.created_at, now()),
    v_consent,
    v_consent_at,
    v_consent_text
  );

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.prebooking_sync_customer_consent()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_consent boolean;
  v_consent_at timestamptz;
  v_consent_text text;
BEGIN
  IF coalesce(trim(NEW.customer_info->>'email'), '') = '' THEN
    RETURN NEW;
  END IF;

  SELECT ac.consent, ac.consent_at, ac.consent_text
  INTO v_consent, v_consent_at, v_consent_text
  FROM public.apply_sms_consent_from_json(NEW.customer_info) ac;

  PERFORM public.upsert_customer_from_booking_info(
    NEW.customer_info->>'email',
    NEW.customer_info->>'name',
    NEW.customer_info->>'phone',
    coalesce(NEW.created_at, now()),
    v_consent,
    v_consent_at,
    v_consent_text
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prebooking_sync_customer_consent_after ON public."Prebooking";
CREATE TRIGGER prebooking_sync_customer_consent_after
  AFTER INSERT OR UPDATE OF customer_info ON public."Prebooking"
  FOR EACH ROW
  EXECUTE FUNCTION public.prebooking_sync_customer_consent();

CREATE OR REPLACE VIEW public.sms_marketing_opt_ins
WITH (security_invoker = true) AS
SELECT
  'booking'::text AS source,
  b.id AS record_id,
  b.order_number AS reference,
  b.customer_info->>'name' AS name,
  b.customer_info->>'phone' AS phone,
  b.customer_info->>'email' AS email,
  (b.customer_info->>'sms_marketing_consent')::boolean AS sms_marketing_consent,
  NULLIF(trim(b.customer_info->>'sms_marketing_consent_at'), '')::timestamptz AS sms_marketing_consent_at,
  b.customer_info->>'sms_marketing_consent_text' AS sms_marketing_consent_text,
  b.created_at
FROM public.bookings b
WHERE lower(coalesce(b.customer_info->>'sms_marketing_consent', '')) = 'true'

UNION ALL

SELECT
  'prebooking'::text AS source,
  p.id AS record_id,
  p.id::text AS reference,
  p.customer_info->>'name' AS name,
  p.customer_info->>'phone' AS phone,
  p.customer_info->>'email' AS email,
  (p.customer_info->>'sms_marketing_consent')::boolean AS sms_marketing_consent,
  NULLIF(trim(p.customer_info->>'sms_marketing_consent_at'), '')::timestamptz AS sms_marketing_consent_at,
  p.customer_info->>'sms_marketing_consent_text' AS sms_marketing_consent_text,
  p.created_at
FROM public."Prebooking" p
WHERE lower(coalesce(p.customer_info->>'sms_marketing_consent', '')) = 'true';

COMMENT ON VIEW public.sms_marketing_opt_ins IS
  'SMS marketing opt-ins. Not exposed via PostgREST; query through crm_sms_marketing_opt_ins (admin) or service_role.';

-- View is not granted to anon/authenticated; see 20260628130000_secure_sms_marketing_consent.sql

WITH consent_rows AS (
  SELECT DISTINCT ON (lower(trim(b.customer_info->>'email')))
    lower(trim(b.customer_info->>'email')) AS email,
    ac.consent_at,
    ac.consent_text
  FROM public.bookings b
  CROSS JOIN LATERAL public.apply_sms_consent_from_json(b.customer_info) ac
  WHERE coalesce(trim(b.customer_info->>'email'), '') <> ''
    AND ac.consent IS TRUE
  ORDER BY lower(trim(b.customer_info->>'email')), ac.consent_at DESC NULLS LAST
)
UPDATE public.customers c
SET
  sms_marketing_consent = true,
  sms_marketing_consent_at = cr.consent_at,
  sms_marketing_consent_text = cr.consent_text,
  updated_at = now()
FROM consent_rows cr
WHERE c.email = cr.email;

WITH consent_rows AS (
  SELECT DISTINCT ON (lower(trim(p.customer_info->>'email')))
    lower(trim(p.customer_info->>'email')) AS email,
    ac.consent_at,
    ac.consent_text
  FROM public."Prebooking" p
  CROSS JOIN LATERAL public.apply_sms_consent_from_json(p.customer_info) ac
  WHERE coalesce(trim(p.customer_info->>'email'), '') <> ''
    AND ac.consent IS TRUE
  ORDER BY lower(trim(p.customer_info->>'email')), ac.consent_at DESC NULLS LAST
)
UPDATE public.customers c
SET
  sms_marketing_consent = true,
  sms_marketing_consent_at = cr.consent_at,
  sms_marketing_consent_text = cr.consent_text,
  updated_at = now()
FROM consent_rows cr
WHERE c.email = cr.email;
