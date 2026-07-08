-- Applied directly to production on 2026-07-04. Synced into the repo retroactively.
-- NOTE: superseded by 20260704032153.
DROP POLICY IF EXISTS "anon_dev_read_bookings" ON public.bookings;
DROP POLICY IF EXISTS "anon_dev_insert_bookings" ON public.bookings;
DROP POLICY IF EXISTS "anon_dev_update_bookings" ON public.bookings;

CREATE POLICY "anon_dev_read_bookings" ON public.bookings
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "authenticated_read_bookings" ON public.bookings
  FOR SELECT
  TO authenticated
  USING (true);
