-- Align bookings with the current submission flow:
-- structured address, schedule time slots, photo step, and Stripe deposit fields.

COMMENT ON COLUMN public.bookings.booking_details IS
  'Service JSON: service_type, preferred_date (YYYY-MM-DD), preferred_time (e.g. Morning (8am – 12pm)), details, estimated_items[], estimated_volume, price, estimate_summary, photo_url, deposit_amount, deposit_paid, stripe_payment_intent_id, terms_accepted_at';

COMMENT ON COLUMN public."Prebooking".booking_details IS
  'Partial booking JSON; may include photo_url, preferred_date, preferred_time, and estimate fields before conversion.';

CREATE INDEX IF NOT EXISTS bookings_stripe_payment_intent_idx
  ON public.bookings ((booking_details->>'stripe_payment_intent_id'))
  WHERE (booking_details->>'stripe_payment_intent_id') IS NOT NULL
    AND (booking_details->>'stripe_payment_intent_id') <> '';

CREATE OR REPLACE FUNCTION public.validate_booking_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_service text := lower(coalesce(NEW.booking_details->>'service_type', ''));
  v_deposit_paid text := lower(coalesce(NEW.booking_details->>'deposit_paid', ''));
BEGIN
  IF coalesce(trim(NEW.customer_info->>'name'), '') = '' THEN
    RAISE EXCEPTION 'customer name is required' USING ERRCODE = '23514';
  END IF;

  IF coalesce(trim(NEW.customer_info->>'email'), '') = '' THEN
    RAISE EXCEPTION 'customer email is required' USING ERRCODE = '23514';
  END IF;

  IF coalesce(trim(NEW.customer_info->>'phone'), '') = '' THEN
    RAISE EXCEPTION 'customer phone is required' USING ERRCODE = '23514';
  END IF;

  IF coalesce(trim(NEW.location_info->>'address'), '') = '' THEN
    RAISE EXCEPTION 'service address is required' USING ERRCODE = '23514';
  END IF;

  IF coalesce(trim(NEW.booking_details->>'preferred_date'), '') = '' THEN
    RAISE EXCEPTION 'preferred_date is required' USING ERRCODE = '23514';
  END IF;

  IF v_service LIKE '%junk%'
     AND coalesce(trim(NEW.booking_details->>'photo_url'), '') = '' THEN
    RAISE EXCEPTION 'photo_url is required for junk removal bookings' USING ERRCODE = '23514';
  END IF;

  IF v_deposit_paid IN ('true', 't', '1')
     AND coalesce(trim(NEW.booking_details->>'stripe_payment_intent_id'), '') = '' THEN
    RAISE EXCEPTION 'stripe_payment_intent_id is required when deposit_paid is true' USING ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_booking_submission ON public.bookings;
CREATE TRIGGER validate_booking_submission
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_booking_submission();

CREATE OR REPLACE FUNCTION public.sync_payment_status_on_booking_deposit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(coalesce(NEW.booking_details->>'deposit_paid', '')) IN ('true', 't', '1')
     AND coalesce(NEW.booking_details->>'stripe_payment_intent_id', '') <> ''
  THEN
    UPDATE public.payments
    SET status = 'succeeded',
        updated_at = now()
    WHERE stripe_payment_intent_id = NEW.booking_details->>'stripe_payment_intent_id'
      AND status IS DISTINCT FROM 'succeeded';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_payment_status_on_booking_deposit ON public.bookings;
CREATE TRIGGER sync_payment_status_on_booking_deposit
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_payment_status_on_booking_deposit();

REVOKE UPDATE, DELETE, TRUNCATE ON public.bookings FROM anon;

REVOKE EXECUTE ON FUNCTION public.validate_booking_submission() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_payment_status_on_booking_deposit() FROM PUBLIC, anon, authenticated;
