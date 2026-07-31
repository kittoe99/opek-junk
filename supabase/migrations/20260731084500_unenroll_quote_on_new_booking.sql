-- On NEW bookings only: remove contact from Quote Requests drip.
-- No backfill. INSERT triggers only.
-- Primary path: same-DB unenroll (reliable).
-- Secondary: notify unenroll-quote-on-booking edge function when webhook auth is configured.

CREATE OR REPLACE FUNCTION public.sms_unenroll_quote_requests_for_phone(
  p_phone text,
  p_booking_id text DEFAULT NULL,
  p_source text DEFAULT 'booking'
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_digits text;
  v_last10 text;
  v_count integer := 0;
BEGIN
  v_digits := public.sms_normalize_phone(p_phone);
  IF v_digits IS NULL THEN
    RETURN 0;
  END IF;
  v_last10 := right(v_digits, 10);

  UPDATE public.sms_automation_enrollments e
  SET
    status = 'removed',
    updated_at = now(),
    metadata = coalesce(e.metadata, '{}'::jsonb) || jsonb_build_object(
      'removedReason', 'new_booking',
      'removedByBookingId', p_booking_id,
      'removedBySource', p_source,
      'drip', coalesce(e.metadata->'drip', '{}'::jsonb) || jsonb_build_object(
        'status', 'completed',
        'pauseReason', 'new_booking',
        'nextSendAt', NULL
      )
    )
  WHERE e.category_id = 'quote-requests'
    AND e.status = 'enrolled'
    AND right(e.phone_digits, 10) = v_last10;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

COMMENT ON FUNCTION public.sms_unenroll_quote_requests_for_phone(text, text, text) IS
  'Removes active quote-requests enrollments for a phone (used when a new booking is created).';

CREATE OR REPLACE FUNCTION public.trigger_unenroll_quote_on_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, net
AS $$
DECLARE
  payload jsonb;
  service_role_key text;
  internal_secret text;
  auth_token text;
  v_phone text;
BEGIN
  IF TG_TABLE_NAME = 'agent_bookings' THEN
    v_phone := nullif(trim(coalesce(NEW.customer_phone, '')), '');
  ELSE
    v_phone := nullif(trim(coalesce(NEW.customer_info->>'phone', '')), '');
  END IF;

  IF v_phone IS NULL THEN
    RETURN NEW;
  END IF;

  -- Primary: remove Quote Requests enrollment immediately in-DB.
  PERFORM public.sms_unenroll_quote_requests_for_phone(
    v_phone,
    NEW.id::text,
    TG_TABLE_NAME
  );

  -- Secondary: notify edge function when auth is configured.
  service_role_key := nullif(current_setting('app.settings.supabase_service_role_key', true), '');
  internal_secret := nullif(current_setting('app.settings.internal_webhook_secret', true), '');
  auth_token := coalesce(service_role_key, internal_secret);

  IF auth_token IS NOT NULL THEN
    payload := jsonb_build_object(
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'schema', TG_TABLE_SCHEMA,
      'record', row_to_json(NEW)::jsonb,
      'phone', v_phone,
      'bookingId', NEW.id::text,
      'source', TG_TABLE_NAME
    );

    PERFORM net.http_post(
      url := 'https://mjgwoukwyqwoectxfwqv.supabase.co/functions/v1/unenroll-quote-on-booking',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || auth_token
      ),
      body := payload,
      timeout_milliseconds := 5000
    );
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'trigger_unenroll_quote_on_booking failed for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.trigger_unenroll_quote_on_booking() IS
  'INSERT-only: unenrolls Quote Requests drip for the booking phone; optionally notifies edge function.';

DROP TRIGGER IF EXISTS bookings_unenroll_quote_on_insert ON public.bookings;
CREATE TRIGGER bookings_unenroll_quote_on_insert
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_unenroll_quote_on_booking();

DROP TRIGGER IF EXISTS agent_bookings_unenroll_quote_on_insert ON public.agent_bookings;
CREATE TRIGGER agent_bookings_unenroll_quote_on_insert
  AFTER INSERT ON public.agent_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_unenroll_quote_on_booking();
