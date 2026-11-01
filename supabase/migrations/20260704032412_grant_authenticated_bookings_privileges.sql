-- Applied directly to production on 2026-07-04. Synced into the repo retroactively.
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
