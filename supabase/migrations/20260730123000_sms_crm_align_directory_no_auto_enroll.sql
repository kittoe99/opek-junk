-- Align SMS CRM directory with Opek-main lead intake (no auto-enrollment).
-- Sources: bookings, Prebooking, contacts, in_home_estimates, agent_bookings, customers.
-- Excludes drivers/provider_signups.

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
      b.created_at AS latest_at
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
      p.created_at
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
      c.created_at
    FROM public.contacts c
    WHERE coalesce(trim(c.customer_info->>'phone'), '') <> ''

    UNION ALL

    SELECT
      nullif(trim(i.customer_info->>'phone'), ''),
      public.sms_normalize_phone(i.customer_info->>'phone'),
      nullif(trim(i.customer_info->>'name'), ''),
      lower(nullif(trim(i.customer_info->>'email'), '')),
      'in_home_estimate',
      NULL,
      i.created_at
    FROM public.in_home_estimates i
    WHERE coalesce(trim(i.customer_info->>'phone'), '') <> ''

    UNION ALL

    SELECT
      nullif(trim(a.customer_phone), ''),
      public.sms_normalize_phone(a.customer_phone),
      nullif(trim(a.customer_name), ''),
      lower(nullif(trim(a.customer_email), '')),
      coalesce(nullif(trim(a.source), ''), 'phone_agent'),
      NULL,
      a.created_at
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
      coalesce(cu.last_booking_at, cu.updated_at, cu.created_at)
    FROM public.customers cu
    WHERE coalesce(trim(cu.phone), '') <> ''
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
    NULL::text AS suggested_category_id,
    a.sms_marketing_consent,
    a.latest_at,
    a.record_count,
    '{}'::text[] AS enrollments
  FROM agg a
  ORDER BY a.latest_at DESC NULLS LAST
  LIMIT v_limit
  OFFSET v_offset;
END;
$$;

COMMENT ON FUNCTION public.sms_crm_list_contacts(text, text, integer, integer) IS
  'Phone-keyed SMS CRM directory aligned with Opek-main intake. No auto-enrollment into automation groups.';
