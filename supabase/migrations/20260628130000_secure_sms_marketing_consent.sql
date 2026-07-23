-- Lock down SMS marketing consent data: admin-only reads, internal functions not RPC-callable.

-- ---------------------------------------------------------------------------
-- 1. Opt-in view: service_role + CRM admin RPC only (not open to authenticated)
-- ---------------------------------------------------------------------------
REVOKE ALL ON public.sms_marketing_opt_ins FROM PUBLIC, anon, authenticated;

GRANT SELECT ON public.sms_marketing_opt_ins TO service_role;

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

CREATE OR REPLACE FUNCTION public.crm_sms_marketing_opt_ins(p_search text DEFAULT NULL)
RETURNS TABLE (
  source text,
  record_id uuid,
  reference text,
  name text,
  phone text,
  email text,
  sms_marketing_consent boolean,
  sms_marketing_consent_at timestamptz,
  sms_marketing_consent_text text,
  created_at timestamptz
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
  SELECT
    o.source,
    o.record_id,
    o.reference,
    o.name,
    o.phone,
    o.email,
    o.sms_marketing_consent,
    o.sms_marketing_consent_at,
    o.sms_marketing_consent_text,
    o.created_at
  FROM public.sms_marketing_opt_ins o
  WHERE p_search IS NULL
     OR lower(coalesce(o.email, '')) LIKE '%' || lower(trim(p_search)) || '%'
     OR coalesce(o.name, '') ILIKE '%' || trim(p_search) || '%'
     OR coalesce(o.phone, '') ILIKE '%' || trim(p_search) || '%'
  ORDER BY o.created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.crm_sms_marketing_opt_ins(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.crm_sms_marketing_opt_ins(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_sms_marketing_opt_ins(text) TO service_role;

-- ---------------------------------------------------------------------------
-- 3. Internal trigger/helper functions: not callable via PostgREST RPC
-- ---------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.apply_sms_consent_from_json(jsonb) FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.prebooking_sync_customer_consent() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.bookings_sync_customer_id() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.upsert_customer_from_booking_info(text, text, text, timestamptz)
  FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.upsert_customer_from_booking_info(
  text, text, text, timestamptz, boolean, timestamptz, text
) FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.refresh_customer_booking_stats(uuid) FROM PUBLIC, anon, authenticated;
