-- Unified SMS CRM contact directory + automation group enrollments
-- Applied to project mjgwoukwyqwoectxfwqv via MCP; kept here for repo parity.

CREATE TABLE IF NOT EXISTS public.sms_automation_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  phone_digits text NOT NULL,
  category_id text NOT NULL,
  name text,
  email text,
  source text,
  record_id text,
  status text NOT NULL DEFAULT 'enrolled'
    CHECK (status = ANY (ARRAY['enrolled'::text, 'paused'::text, 'completed'::text, 'removed'::text])),
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS sms_automation_enrollments_phone_category_active_uidx
  ON public.sms_automation_enrollments (phone_digits, category_id)
  WHERE status = 'enrolled';

CREATE INDEX IF NOT EXISTS sms_automation_enrollments_category_idx
  ON public.sms_automation_enrollments (category_id, enrolled_at DESC);

CREATE INDEX IF NOT EXISTS sms_automation_enrollments_phone_digits_idx
  ON public.sms_automation_enrollments (phone_digits);

ALTER TABLE public.sms_automation_enrollments ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.sms_automation_enrollments FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.sms_automation_enrollments TO service_role;

CREATE OR REPLACE FUNCTION public.sms_normalize_phone(p_phone text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT NULLIF(regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g'), '');
$$;

REVOKE ALL ON FUNCTION public.sms_normalize_phone(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sms_normalize_phone(text) TO service_role;

CREATE OR REPLACE FUNCTION public.sms_crm_list_contacts(
  p_search text DEFAULT NULL,
  p_source text DEFAULT NULL,
  p_limit integer DEFAULT 100,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  phone text,
  phone_digits text,
  name text,
  email text,
  sources text[],
  primary_source text,
  suggested_category_id text,
  sms_marketing_consent boolean,
  latest_at timestamptz,
  record_count bigint,
  enrollments text[]
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_limit integer := LEAST(GREATEST(coalesce(p_limit, 100), 1), 500);
  v_offset integer := GREATEST(coalesce(p_offset, 0), 0);
BEGIN
  RETURN QUERY
  WITH events AS (
    SELECT
      nullif(trim(b.customer_info->>'phone'), '') AS phone,
      public.sms_normalize_phone(b.customer_info->>'phone') AS phone_digits,
      nullif(trim(b.customer_info->>'name'), '') AS name,
      lower(nullif(trim(b.customer_info->>'email'), '')) AS email,
      'booking'::text AS source,
      CASE lower(coalesce(b.customer_info->>'sms_marketing_consent', ''))
        WHEN 'true' THEN true
        WHEN 'false' THEN false
        ELSE NULL
      END AS sms_marketing_consent,
      b.created_at AS latest_at,
      'appointment-reminders'::text AS suggested_category_id
    FROM public.bookings b
    WHERE coalesce(trim(b.customer_info->>'phone'), '') <> ''

    UNION ALL

    SELECT
      nullif(trim(p.customer_info->>'phone'), ''),
      public.sms_normalize_phone(p.customer_info->>'phone'),
      nullif(trim(p.customer_info->>'name'), ''),
      lower(nullif(trim(p.customer_info->>'email'), '')),
      'prebooking',
      CASE lower(coalesce(p.customer_info->>'sms_marketing_consent', ''))
        WHEN 'true' THEN true
        WHEN 'false' THEN false
        ELSE NULL
      END,
      p.created_at,
      'quote-requests'
    FROM public."Prebooking" p
    WHERE coalesce(trim(p.customer_info->>'phone'), '') <> ''

    UNION ALL

    SELECT
      nullif(trim(c.customer_info->>'phone'), ''),
      public.sms_normalize_phone(c.customer_info->>'phone'),
      nullif(trim(c.customer_info->>'name'), ''),
      lower(nullif(trim(c.customer_info->>'email'), '')),
      'contact',
      NULL,
      c.created_at,
      'quote-requests'
    FROM public.contacts c
    WHERE coalesce(trim(c.customer_info->>'phone'), '') <> ''

    UNION ALL

    SELECT
      nullif(trim(a.customer_phone), ''),
      public.sms_normalize_phone(a.customer_phone),
      nullif(trim(a.customer_name), ''),
      lower(nullif(trim(a.customer_email), '')),
      coalesce(nullif(trim(a.source), ''), 'phone_agent'),
      NULL,
      a.created_at,
      'quote-requests'
    FROM public.agent_bookings a
    WHERE coalesce(trim(a.customer_phone), '') <> ''

    UNION ALL

    SELECT
      nullif(trim(cu.phone), ''),
      public.sms_normalize_phone(cu.phone),
      nullif(trim(cu.name), ''),
      lower(nullif(trim(cu.email), '')),
      'customer',
      cu.sms_marketing_consent,
      coalesce(cu.last_booking_at, cu.updated_at, cu.created_at),
      CASE
        WHEN coalesce(cu.booking_count, 0) > 0 THEN 'followup-automations'
        ELSE 'quote-requests'
      END
    FROM public.customers cu
    WHERE coalesce(trim(cu.phone), '') <> ''

    UNION ALL

    SELECT
      nullif(trim(d.phone), ''),
      public.sms_normalize_phone(d.phone),
      nullif(trim(d.full_name), ''),
      lower(nullif(trim(d.email), '')),
      'driver',
      NULL,
      coalesce(d.updated_at, d.created_at),
      'contractor-sms'
    FROM public.drivers d
    WHERE coalesce(trim(d.phone), '') <> ''
  ),
  filtered AS (
    SELECT e.*
    FROM events e
    WHERE e.phone_digits IS NOT NULL
      AND (p_source IS NULL OR e.source = p_source)
      AND (
        p_search IS NULL
        OR e.phone ILIKE '%' || trim(p_search) || '%'
        OR e.phone_digits ILIKE '%' || regexp_replace(trim(p_search), '[^0-9]', '', 'g') || '%'
        OR coalesce(e.name, '') ILIKE '%' || trim(p_search) || '%'
        OR coalesce(e.email, '') ILIKE '%' || lower(trim(p_search)) || '%'
      )
  ),
  agg AS (
    SELECT
      (array_agg(f.phone ORDER BY f.latest_at DESC))[1] AS phone,
      f.phone_digits,
      (array_agg(f.name ORDER BY f.latest_at DESC) FILTER (WHERE f.name IS NOT NULL))[1] AS name,
      (array_agg(f.email ORDER BY f.latest_at DESC) FILTER (WHERE f.email IS NOT NULL))[1] AS email,
      array_agg(DISTINCT f.source ORDER BY f.source) AS sources,
      (array_agg(f.source ORDER BY f.latest_at DESC))[1] AS primary_source,
      (array_agg(f.suggested_category_id ORDER BY f.latest_at DESC))[1] AS suggested_category_id,
      bool_or(f.sms_marketing_consent) AS sms_marketing_consent,
      max(f.latest_at) AS latest_at,
      count(*)::bigint AS record_count
    FROM filtered f
    GROUP BY f.phone_digits
  )
  SELECT
    a.phone,
    a.phone_digits,
    a.name,
    a.email,
    a.sources,
    a.primary_source,
    a.suggested_category_id,
    a.sms_marketing_consent,
    a.latest_at,
    a.record_count,
    coalesce(
      (
        SELECT array_agg(e.category_id ORDER BY e.category_id)
        FROM public.sms_automation_enrollments e
        WHERE e.phone_digits = a.phone_digits
          AND e.status = 'enrolled'
      ),
      '{}'::text[]
    ) AS enrollments
  FROM agg a
  ORDER BY a.latest_at DESC NULLS LAST
  LIMIT v_limit
  OFFSET v_offset;
END;
$$;

REVOKE ALL ON FUNCTION public.sms_crm_list_contacts(text, text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sms_crm_list_contacts(text, text, integer, integer) TO service_role;

CREATE OR REPLACE FUNCTION public.sms_crm_enroll_contact(
  p_phone text,
  p_category_id text,
  p_name text DEFAULT NULL,
  p_email text DEFAULT NULL,
  p_source text DEFAULT NULL,
  p_record_id text DEFAULT NULL
)
RETURNS public.sms_automation_enrollments
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_digits text := public.sms_normalize_phone(p_phone);
  v_row public.sms_automation_enrollments;
BEGIN
  IF v_digits IS NULL OR coalesce(trim(p_category_id), '') = '' THEN
    RAISE EXCEPTION 'phone and category_id are required';
  END IF;

  INSERT INTO public.sms_automation_enrollments (
    phone, phone_digits, category_id, name, email, source, record_id, status, enrolled_at, updated_at
  ) VALUES (
    trim(p_phone),
    v_digits,
    trim(p_category_id),
    nullif(trim(coalesce(p_name, '')), ''),
    lower(nullif(trim(coalesce(p_email, '')), '')),
    nullif(trim(coalesce(p_source, '')), ''),
    nullif(trim(coalesce(p_record_id, '')), ''),
    'enrolled',
    now(),
    now()
  )
  ON CONFLICT (phone_digits, category_id) WHERE status = 'enrolled'
  DO UPDATE SET
    name = coalesce(EXCLUDED.name, public.sms_automation_enrollments.name),
    email = coalesce(EXCLUDED.email, public.sms_automation_enrollments.email),
    source = coalesce(EXCLUDED.source, public.sms_automation_enrollments.source),
    updated_at = now()
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.sms_crm_enroll_contact(text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sms_crm_enroll_contact(text, text, text, text, text, text) TO service_role;
