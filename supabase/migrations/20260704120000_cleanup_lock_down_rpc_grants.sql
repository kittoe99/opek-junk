-- Cleanup: internal/admin RPCs should not be callable by anon.
-- crm_customer_summary already checks is_crm_admin() internally, but must not be anon-callable.
REVOKE EXECUTE ON FUNCTION public.crm_customer_summary(text) FROM anon;

-- Internal trigger helper wrongly exposed as a public RPC.
REVOKE EXECUTE ON FUNCTION public.bookings_refresh_customer_stats() FROM PUBLIC, anon, authenticated;

-- is_crm_admin is an internal predicate; no need to expose to anon.
REVOKE EXECUTE ON FUNCTION public.is_crm_admin() FROM anon;
