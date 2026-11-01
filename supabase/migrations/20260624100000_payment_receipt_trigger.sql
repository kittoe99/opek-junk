-- Send customer email receipt when a payment succeeds (via send-payment-receipt edge function)
-- NOTE: Edge-function auth is re-secured in 20260730131000_internal_webhook_auth.sql (service_role JWT).

ALTER TABLE public.payments
    ADD COLUMN IF NOT EXISTS receipt_sent_at TIMESTAMPTZ;

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

DROP TRIGGER IF EXISTS send_payment_receipt_on_success ON public.payments;

CREATE TRIGGER send_payment_receipt_on_success
    AFTER INSERT OR UPDATE OF status ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_send_payment_receipt();
