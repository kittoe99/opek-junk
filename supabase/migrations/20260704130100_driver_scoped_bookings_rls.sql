-- Replace the temporary blanket bookings policies with driver-assignment scoping.
-- Admins keep full access via the existing "CRM admin read/update bookings" policies.
DROP POLICY IF EXISTS "authenticated_read_bookings" ON public.bookings;
DROP POLICY IF EXISTS "authenticated_update_bookings" ON public.bookings;
DROP POLICY IF EXISTS "anon_dev_read_bookings" ON public.bookings;
DROP POLICY IF EXISTS "anon_dev_insert_bookings" ON public.bookings;
DROP POLICY IF EXISTS "anon_dev_update_bookings" ON public.bookings;

-- A driver may read a booking only if they have an assignment for it.
CREATE POLICY "Driver reads assigned bookings" ON public.bookings FOR SELECT TO authenticated
  USING (public.driver_can_see_booking(id));

-- Non-admin authenticated users no longer need blanket UPDATE.
REVOKE UPDATE ON public.bookings FROM authenticated;
