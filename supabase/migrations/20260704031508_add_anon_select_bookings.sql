-- Applied directly to production on 2026-07-04 to unblock the driver app.
-- Synced into the repo retroactively. NOTE: superseded by 20260704032153.
CREATE POLICY "anon_dev_read_bookings" ON public.bookings
  FOR SELECT
  TO authenticated, anon
  USING (true);
