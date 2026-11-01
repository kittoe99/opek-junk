-- Dedicated customers table synced automatically from bookings.

CREATE TABLE IF NOT EXISTS public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  booking_count integer NOT NULL DEFAULT 0,
  first_booking_at timestamptz,
  last_booking_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT customers_email_unique UNIQUE (email)
);

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS bookings_customer_id_idx ON public.bookings (customer_id);
CREATE INDEX IF NOT EXISTS customers_last_booking_at_idx ON public.customers (last_booking_at DESC);
CREATE INDEX IF NOT EXISTS customers_email_idx ON public.customers (email);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.customers FROM anon, authenticated;
GRANT SELECT ON public.customers TO authenticated;

CREATE POLICY "Deny direct client access to customers"
  ON public.customers FOR ALL
  USING (false)
  WITH CHECK (false);

CREATE POLICY "CRM admin read customers"
  ON public.customers FOR SELECT TO authenticated
  USING (public.is_crm_admin());

CREATE OR REPLACE FUNCTION public.upsert_customer_from_booking_info(
  p_email text,
  p_name text,
  p_phone text,
  p_booking_at timestamptz DEFAULT now()
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

  INSERT INTO public.customers (email, name, phone, first_booking_at, last_booking_at)
  VALUES (
    v_email,
    coalesce(nullif(trim(p_name), ''), ''),
    coalesce(nullif(trim(p_phone), ''), ''),
    p_booking_at,
    p_booking_at
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
    updated_at = now()
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.upsert_customer_from_booking_info(text, text, text, timestamptz) FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.refresh_customer_booking_stats(p_customer_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_customer_id IS NULL THEN
    RETURN;
  END IF;

  UPDATE public.customers c
  SET
    booking_count = stats.cnt,
    first_booking_at = stats.first_at,
    last_booking_at = stats.last_at,
    updated_at = now()
  FROM (
    SELECT
      count(*)::integer AS cnt,
      min(b.created_at) AS first_at,
      max(b.created_at) AS last_at
    FROM public.bookings b
    WHERE b.customer_id = p_customer_id
  ) stats
  WHERE c.id = p_customer_id;
END;
$$;

REVOKE ALL ON FUNCTION public.refresh_customer_booking_stats(uuid) FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.bookings_sync_customer_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.customer_id := public.upsert_customer_from_booking_info(
    NEW.customer_info->>'email',
    NEW.customer_info->>'name',
    NEW.customer_info->>'phone',
    coalesce(NEW.created_at, now())
  );

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.bookings_refresh_customer_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.refresh_customer_booking_stats(OLD.customer_id);
    RETURN OLD;
  END IF;

  IF NEW.customer_id IS NOT NULL THEN
    PERFORM public.refresh_customer_booking_stats(NEW.customer_id);
  END IF;

  IF TG_OP = 'UPDATE'
     AND OLD.customer_id IS DISTINCT FROM NEW.customer_id
     AND OLD.customer_id IS NOT NULL THEN
    PERFORM public.refresh_customer_booking_stats(OLD.customer_id);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_sync_customer_before ON public.bookings;
CREATE TRIGGER bookings_sync_customer_before
  BEFORE INSERT OR UPDATE OF customer_info ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.bookings_sync_customer_id();

DROP TRIGGER IF EXISTS bookings_refresh_customer_after ON public.bookings;
CREATE TRIGGER bookings_refresh_customer_after
  AFTER INSERT OR UPDATE OF customer_info, customer_id OR DELETE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.bookings_refresh_customer_stats();

-- Backfill from existing bookings
WITH ranked AS (
  SELECT
    lower(trim(b.customer_info->>'email')) AS email,
    coalesce(b.customer_info->>'name', '') AS name,
    coalesce(b.customer_info->>'phone', '') AS phone,
    b.created_at,
    row_number() OVER (
      PARTITION BY lower(trim(b.customer_info->>'email'))
      ORDER BY b.created_at DESC
    ) AS rn
  FROM public.bookings b
  WHERE coalesce(trim(b.customer_info->>'email'), '') <> ''
),
agg AS (
  SELECT
    email,
    count(*)::integer AS booking_count,
    min(created_at) AS first_booking_at,
    max(created_at) AS last_booking_at
  FROM ranked
  GROUP BY email
)
INSERT INTO public.customers (email, name, phone, booking_count, first_booking_at, last_booking_at)
SELECT a.email, r.name, r.phone, a.booking_count, a.first_booking_at, a.last_booking_at
FROM agg a
JOIN ranked r ON r.email = a.email AND r.rn = 1
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  booking_count = EXCLUDED.booking_count,
  first_booking_at = EXCLUDED.first_booking_at,
  last_booking_at = EXCLUDED.last_booking_at,
  updated_at = now();

UPDATE public.bookings b
SET customer_id = c.id
FROM public.customers c
WHERE lower(trim(b.customer_info->>'email')) = c.email
  AND coalesce(trim(b.customer_info->>'email'), '') <> '';

-- CRM summary: prefer customers table for booking counts
DROP FUNCTION IF EXISTS public.crm_customer_summary(text);

CREATE OR REPLACE FUNCTION public.crm_customer_summary(p_search text DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  email text,
  name text,
  phone text,
  bookings bigint,
  contacts bigint,
  prebookings bigint,
  latest_at timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() <> 'service_role' AND NOT public.is_crm_admin() THEN
    RETURN;
  END IF;

  RETURN QUERY
  WITH contact_agg AS (
    SELECT
      lower(trim(customer_info->>'email')) AS email,
      count(*)::bigint AS contacts,
      max(created_at) AS latest_at
    FROM public.contacts
    WHERE coalesce(trim(customer_info->>'email'), '') <> ''
    GROUP BY 1
  ),
  prebooking_agg AS (
    SELECT
      lower(trim(customer_info->>'email')) AS email,
      count(*)::bigint AS prebookings,
      max(created_at) AS latest_at
    FROM public."Prebooking"
    WHERE coalesce(trim(customer_info->>'email'), '') <> ''
    GROUP BY 1
  ),
  all_emails AS (
    SELECT email FROM public.customers
    UNION
    SELECT email FROM contact_agg
    UNION
    SELECT email FROM prebooking_agg
  )
  SELECT
    cust.id,
    ae.email,
    coalesce(cust.name, '') AS name,
    coalesce(cust.phone, '') AS phone,
    coalesce(cust.booking_count, 0)::bigint AS bookings,
    coalesce(ca.contacts, 0::bigint) AS contacts,
    coalesce(pa.prebookings, 0::bigint) AS prebookings,
    greatest(
      coalesce(cust.last_booking_at, '-infinity'::timestamptz),
      coalesce(ca.latest_at, '-infinity'::timestamptz),
      coalesce(pa.latest_at, '-infinity'::timestamptz)
    ) AS latest_at
  FROM all_emails ae
  LEFT JOIN public.customers cust ON cust.email = ae.email
  LEFT JOIN contact_agg ca ON ca.email = ae.email
  LEFT JOIN prebooking_agg pa ON pa.email = ae.email
  WHERE p_search IS NULL
     OR ae.email ILIKE '%' || lower(trim(p_search)) || '%'
     OR coalesce(cust.name, '') ILIKE '%' || trim(p_search) || '%'
     OR coalesce(cust.phone, '') ILIKE '%' || trim(p_search) || '%'
  ORDER BY latest_at DESC NULLS LAST;
END;
$$;

REVOKE ALL ON FUNCTION public.crm_customer_summary(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.crm_customer_summary(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_customer_summary(text) TO service_role;
