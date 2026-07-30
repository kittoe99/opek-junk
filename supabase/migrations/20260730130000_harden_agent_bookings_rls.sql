-- Harden agent_bookings: only CRM admins may read/update; writes via service_role (edge function).

DROP POLICY IF EXISTS agent_bookings_authenticated_select ON public.agent_bookings;
DROP POLICY IF EXISTS agent_bookings_authenticated_update ON public.agent_bookings;

CREATE POLICY agent_bookings_crm_admin_select
  ON public.agent_bookings FOR SELECT
  TO authenticated
  USING (public.is_crm_admin());

CREATE POLICY agent_bookings_crm_admin_update
  ON public.agent_bookings FOR UPDATE
  TO authenticated
  USING (public.is_crm_admin())
  WITH CHECK (public.is_crm_admin());
