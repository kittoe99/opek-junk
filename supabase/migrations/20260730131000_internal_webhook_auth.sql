-- Harden internal edge-function triggers: service_role JWT instead of a hardcoded anon JWT.
-- NOTE: The service role key must be set on the DB before this trigger can authenticate:
--   ALTER DATABASE postgres SET app.settings.supabase_service_role_key = '<service_role_key>';

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

  -- Only call the edge function when the service role key is configured.
  -- Edge function rejects any non-service_role / non-secret Authorization header.
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

CREATE OR REPLACE FUNCTION public.trigger_send_payment_receipt()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
  service_role_key text;
BEGIN
  service_role_key := current_setting('app.settings.supabase_service_role_key', true);

  IF NEW.status = 'succeeded'
     AND NEW.receipt_sent_at IS NULL
     AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'succeeded')
     AND service_role_key IS NOT NULL
     AND service_role_key <> ''
  THEN
    payload := jsonb_build_object(
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'record', row_to_json(NEW)::jsonb,
      'schema', TG_TABLE_SCHEMA
    );

    PERFORM net.http_post(
      url := 'https://mjgwoukwyqwoectxfwqv.supabase.co/functions/v1/send-payment-receipt',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_role_key
      ),
      body := payload,
      timeout_milliseconds := 10000
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, net;
