-- Applied directly to production on 2026-07-04. Synced into the repo retroactively.
-- TODO: replace these blanket USING (true) policies with driver-scoped RLS once
-- the drivers/assignment model exists (see database cleanup review).
DROP POLICY IF EXISTS "anon_dev_read_bookings" ON public.bookings;
DROP POLICY IF EXISTS "authenticated_read_bookings" ON public.bookings;
DROP POLICY IF EXISTS "anon_dev_insert_bookings" ON public.bookings;
DROP POLICY IF EXISTS "anon_dev_update_bookings" ON public.bookings;

CREATE POLICY "authenticated_read_bookings" ON public.bookings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "authenticated_update_bookings" ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
