-- Migration: Setup Database Triggers for Form Submission Email Notifications
-- Creates AFTER INSERT triggers on contacts, bookings, provider_signups, schedule_visits, and in_home_estimates.
-- NOTE: Edge-function auth is re-secured in 20260730131000_internal_webhook_auth.sql (service_role JWT).

-- 1. Ensure pg_net extension is available
CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA net;

-- 2. Create trigger function to invoke the edge function
CREATE OR REPLACE FUNCTION public.trigger_send_form_notification()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
  service_role_key text;
BEGIN
  service_role_key := current_setting('app.settings.supabase_service_role_key', true);

  payload := jsonb_build_object(
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'record', row_to_json(NEW)::jsonb,
    'schema', TG_TABLE_SCHEMA
  );

  IF service_role_key IS NOT NULL AND service_role_key <> '' THEN
    PERFORM net.http_post(
      url := 'https://mjgwoukwyqwoectxfwqv.supabase.co/functions/v1/send-form-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_role_key
      ),
      body := payload,
      timeout_milliseconds := 5000
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, net;

-- 3. Cleanup existing triggers if any
DROP TRIGGER IF EXISTS send_notification_on_insert ON public.contacts;
DROP TRIGGER IF EXISTS send_notification_on_insert ON public.bookings;
DROP TRIGGER IF EXISTS send_notification_on_insert ON public.provider_signups;
DROP TRIGGER IF EXISTS send_notification_on_insert ON public.schedule_visits;
DROP TRIGGER IF EXISTS send_notification_on_insert ON public.in_home_estimates;

-- 4. Re-create AFTER INSERT triggers on all form submission tables
CREATE TRIGGER send_notification_on_insert
  AFTER INSERT ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_send_form_notification();

CREATE TRIGGER send_notification_on_insert
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_send_form_notification();

CREATE TRIGGER send_notification_on_insert
  AFTER INSERT ON public.provider_signups
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_send_form_notification();

CREATE TRIGGER send_notification_on_insert
  AFTER INSERT ON public.schedule_visits
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_send_form_notification();

CREATE TRIGGER send_notification_on_insert
  AFTER INSERT ON public.in_home_estimates
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_send_form_notification();
