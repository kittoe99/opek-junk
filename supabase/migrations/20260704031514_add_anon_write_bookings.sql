-- Applied directly to production on 2026-07-04 to unblock the driver app.
-- Synced into the repo retroactively. NOTE: superseded by 20260704032153.
CREATE POLICY "anon_dev_insert_bookings" ON public.bookings
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "anon_dev_update_bookings" ON public.bookings
  FOR UPDATE
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);
