-- Allow CRM admins (authenticated JWT) to access PII tables without service_role.
-- Admins are listed in crm_admins; API verifies JWT + ADMIN_EMAILS before queries run.

CREATE TABLE IF NOT EXISTS public.crm_admins (
  email text PRIMARY KEY
);

INSERT INTO public.crm_admins (email) VALUES
  ('kofikittoe35@gmail.com'),
  ('support@opekjunkremoval.com')
ON CONFLICT (email) DO NOTHING;

ALTER TABLE public.crm_admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny direct access to crm_admins"
  ON public.crm_admins FOR ALL
  USING (false)
  WITH CHECK (false);

REVOKE ALL ON public.crm_admins FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.is_crm_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.crm_admins a
    WHERE a.email = lower(trim(coalesce(auth.jwt()->>'email', '')))
  );
$$;

REVOKE ALL ON FUNCTION public.is_crm_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_crm_admin() TO authenticated;

-- Bookings
CREATE POLICY "CRM admin read bookings"
  ON public.bookings FOR SELECT TO authenticated
  USING (public.is_crm_admin());

CREATE POLICY "CRM admin update bookings"
  ON public.bookings FOR UPDATE TO authenticated
  USING (public.is_crm_admin())
  WITH CHECK (public.is_crm_admin());

-- Order status history
CREATE POLICY "CRM admin read order_status_history"
  ON public.order_status_history FOR SELECT TO authenticated
  USING (public.is_crm_admin());

CREATE POLICY "CRM admin insert order_status_history"
  ON public.order_status_history FOR INSERT TO authenticated
  WITH CHECK (public.is_crm_admin());

-- Form tables
CREATE POLICY "CRM admin read contacts"
  ON public.contacts FOR SELECT TO authenticated
  USING (public.is_crm_admin());

CREATE POLICY "CRM admin read prebookings"
  ON public."Prebooking" FOR SELECT TO authenticated
  USING (public.is_crm_admin());

CREATE POLICY "CRM admin read provider_signups"
  ON public.provider_signups FOR SELECT TO authenticated
  USING (public.is_crm_admin());

CREATE POLICY "CRM admin update provider_signups"
  ON public.provider_signups FOR UPDATE TO authenticated
  USING (public.is_crm_admin())
  WITH CHECK (public.is_crm_admin());

CREATE POLICY "CRM admin read schedule_visits"
  ON public.schedule_visits FOR SELECT TO authenticated
  USING (public.is_crm_admin());

CREATE POLICY "CRM admin update schedule_visits"
  ON public.schedule_visits FOR UPDATE TO authenticated
  USING (public.is_crm_admin())
  WITH CHECK (public.is_crm_admin());

CREATE POLICY "CRM admin read in_home_estimates"
  ON public.in_home_estimates FOR SELECT TO authenticated
  USING (public.is_crm_admin());

-- Payments / Stripe
CREATE POLICY "CRM admin read payments"
  ON public.payments FOR SELECT TO authenticated
  USING (public.is_crm_admin());

CREATE POLICY "CRM admin read stripe_customers"
  ON public.stripe_customers FOR SELECT TO authenticated
  USING (public.is_crm_admin());

-- CRM email log
CREATE POLICY "CRM admin insert crm_email_log"
  ON public.crm_email_log FOR INSERT TO authenticated
  WITH CHECK (public.is_crm_admin());

CREATE POLICY "CRM admin read crm_email_log"
  ON public.crm_email_log FOR SELECT TO authenticated
  USING (public.is_crm_admin());

-- Customer summary RPC: allow authenticated admins
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
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_crm_admin() THEN
    RETURN;
  END IF;

  RETURN QUERY
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
END;
$$;

REVOKE ALL ON FUNCTION public.crm_customer_summary(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.crm_customer_summary(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_customer_summary(text) TO service_role;
