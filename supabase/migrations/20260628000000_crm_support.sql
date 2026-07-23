-- CRM support: email audit log + customer summary RPC

CREATE TABLE IF NOT EXISTS public.crm_email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sent_by uuid REFERENCES auth.users(id),
  function_name text NOT NULL,
  record_type text,
  record_id uuid,
  recipient text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_email_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny client access to crm_email_log"
  ON public.crm_email_log FOR ALL
  USING (false)
  WITH CHECK (false);

REVOKE ALL ON public.crm_email_log FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.crm_customer_summary(p_search text DEFAULT NULL)
RETURNS TABLE (
  email text,
  name text,
  phone text,
  bookings bigint,
  contacts bigint,
  prebookings bigint,
  latest_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH combined AS (
    SELECT
      lower(trim(customer_info->>'email')) AS email,
      customer_info->>'name' AS name,
      customer_info->>'phone' AS phone,
      'booking'::text AS source,
      created_at
    FROM bookings
    WHERE coalesce(trim(customer_info->>'email'), '') <> ''

    UNION ALL

    SELECT
      lower(trim(customer_info->>'email')),
      customer_info->>'name',
      customer_info->>'phone',
      'contact',
      created_at
    FROM contacts
    WHERE coalesce(trim(customer_info->>'email'), '') <> ''

    UNION ALL

    SELECT
      lower(trim(customer_info->>'email')),
      customer_info->>'name',
      customer_info->>'phone',
      'prebooking',
      created_at
    FROM "Prebooking"
    WHERE coalesce(trim(customer_info->>'email'), '') <> ''
  ),
  agg AS (
    SELECT
      c.email,
      (array_agg(c.name ORDER BY c.created_at DESC))[1] AS name,
      (array_agg(c.phone ORDER BY c.created_at DESC))[1] AS phone,
      count(*) FILTER (WHERE c.source = 'booking') AS bookings,
      count(*) FILTER (WHERE c.source = 'contact') AS contacts,
      count(*) FILTER (WHERE c.source = 'prebooking') AS prebookings,
      max(c.created_at) AS latest_at
    FROM combined c
    GROUP BY c.email
  )
  SELECT * FROM agg
  WHERE p_search IS NULL
     OR email ILIKE '%' || lower(trim(p_search)) || '%'
     OR name ILIKE '%' || trim(p_search) || '%'
     OR phone ILIKE '%' || trim(p_search) || '%'
  ORDER BY latest_at DESC;
$$;

REVOKE ALL ON FUNCTION public.crm_customer_summary(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.crm_customer_summary(text) TO service_role;
