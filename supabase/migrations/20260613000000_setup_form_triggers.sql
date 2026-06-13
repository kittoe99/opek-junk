-- Migration: Setup Database Triggers for Form Submission Email Notifications
-- Creates AFTER INSERT triggers on contacts, bookings, provider_signups, schedule_visits, and in_home_estimates.

-- 1. Ensure pg_net extension is available
CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA net;

-- 2. Create trigger function to invoke the edge function
CREATE OR REPLACE FUNCTION public.trigger_send_form_notification()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
BEGIN
  -- Build the webhook payload matching send-form-notification's WebhookPayload interface
  payload := jsonb_build_object(
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'record', row_to_json(NEW)::jsonb,
    'schema', TG_TABLE_SCHEMA
  );

  -- Queue HTTP request using pg_net (runs asynchronously after commit)
  PERFORM net.http_post(
    url := 'https://mjgwoukwyqwoectxfwqv.supabase.co/functions/v1/send-form-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3dvdWt3eXF3b2VjdHhmd3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjAzNjcsImV4cCI6MjA3MDMzNjM2N30.3ee-rHN_BYQKaZmLOTiyoVxU4fYLDnNnfToI8veH5F8'
    ),
    body := payload,
    timeout_milliseconds := 5000
  );

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
