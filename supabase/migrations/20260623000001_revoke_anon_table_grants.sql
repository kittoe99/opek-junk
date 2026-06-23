-- Migration: Defense-in-depth — revoke direct anon SELECT grants on PII tables.
-- RLS already denies anon row reads on these tables, but anon retained the
-- table-level SELECT grant which keeps them discoverable via the auto-generated
-- API/GraphQL schema. Reads happen through SECURITY DEFINER RPCs (track_order,
-- get_order_status_history) or the service role, so anon never needs SELECT.
-- Anon keeps INSERT where the public submission forms require it.

REVOKE SELECT ON public.bookings FROM anon;
REVOKE SELECT ON public."Prebooking" FROM anon;
REVOKE SELECT ON public.contacts FROM anon;
REVOKE SELECT ON public.provider_signups FROM anon;
REVOKE SELECT ON public.schedule_visits FROM anon;
REVOKE SELECT ON public.in_home_estimates FROM anon;
REVOKE SELECT ON public.payments FROM anon;
REVOKE SELECT ON public.stripe_webhook_events FROM anon;
