-- Send customer email receipt when a payment succeeds (via send-payment-receipt edge function)

ALTER TABLE public.payments
    ADD COLUMN IF NOT EXISTS receipt_sent_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION public.trigger_send_payment_receipt()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
BEGIN
  IF NEW.status = 'succeeded'
     AND NEW.receipt_sent_at IS NULL
     AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'succeeded')
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
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3dvdWt3eXF3b2VjdHhmd3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjAzNjcsImV4cCI6MjA3MDMzNjM2N30.3ee-rHN_BYQKaZmLOTiyoVxU4fYLDnNnfToI8veH5F8'
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
