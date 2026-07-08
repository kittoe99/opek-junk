-- Cleanup: pin search_path on Opek functions flagged by the security linter (mutable search_path).
ALTER FUNCTION public.apply_sms_consent_from_json(jsonb) SET search_path = public;
ALTER FUNCTION public.insert_initial_status_history() SET search_path = public;
ALTER FUNCTION public.log_status_change() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
