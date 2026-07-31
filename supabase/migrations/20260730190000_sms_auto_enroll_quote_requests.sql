-- Auto-enroll quote-page Prebooking leads with SMS marketing consent
-- into the quote-requests SMS automation group.

CREATE OR REPLACE FUNCTION public.sms_auto_enroll_quote_prebooking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_consent text;
  v_phone text;
  v_name text;
  v_email text;
  v_intake text;
BEGIN
  v_intake := lower(coalesce(NEW.booking_details->>'intake_source', ''));
  IF v_intake IS DISTINCT FROM 'quote' THEN
    RETURN NEW;
  END IF;

  v_consent := lower(coalesce(NEW.customer_info->>'sms_marketing_consent', ''));
  IF v_consent NOT IN ('true', 't', '1', 'yes') THEN
    RETURN NEW;
  END IF;

  v_phone := nullif(trim(coalesce(NEW.customer_info->>'phone', '')), '');
  IF v_phone IS NULL OR public.sms_normalize_phone(v_phone) IS NULL THEN
    RETURN NEW;
  END IF;

  v_name := nullif(trim(coalesce(NEW.customer_info->>'name', '')), '');
  v_email := lower(nullif(trim(coalesce(NEW.customer_info->>'email', '')), ''));

  PERFORM public.sms_crm_enroll_contact(
    v_phone,
    'quote-requests',
    v_name,
    v_email,
    'quote',
    NEW.id::text
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Never block quote lead capture if enrollment fails
    RAISE WARNING 'sms_auto_enroll_quote_prebooking failed for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prebooking_auto_enroll_quote_requests ON public."Prebooking";
CREATE TRIGGER prebooking_auto_enroll_quote_requests
  AFTER INSERT OR UPDATE OF customer_info, booking_details
  ON public."Prebooking"
  FOR EACH ROW
  EXECUTE FUNCTION public.sms_auto_enroll_quote_prebooking();

COMMENT ON FUNCTION public.sms_auto_enroll_quote_prebooking() IS
  'Enrolls quote-page Prebooking rows with sms_marketing_consent=true into quote-requests.';

-- Backfill: existing quote-tagged consented leads (none yet until frontend ships),
-- plus consented Prebooking leads that look like quote estimates (have price + estimated_items)
-- and are not already enrolled.
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT
      p.id,
      nullif(trim(p.customer_info->>'phone'), '') AS phone,
      nullif(trim(p.customer_info->>'name'), '') AS name,
      lower(nullif(trim(p.customer_info->>'email'), '')) AS email
    FROM public."Prebooking" p
    WHERE lower(coalesce(p.customer_info->>'sms_marketing_consent', '')) IN ('true', 't', '1', 'yes')
      AND nullif(trim(coalesce(p.customer_info->>'phone', '')), '') IS NOT NULL
      AND public.sms_normalize_phone(p.customer_info->>'phone') IS NOT NULL
      AND (
        lower(coalesce(p.booking_details->>'intake_source', '')) = 'quote'
        OR (
          p.booking_details ? 'price'
          AND p.booking_details ? 'estimated_items'
          AND coalesce(p.status, '') IN ('partially_submitted', 'submitted', 'quoted')
        )
      )
      AND NOT EXISTS (
        SELECT 1
        FROM public.sms_automation_enrollments e
        WHERE e.phone_digits = public.sms_normalize_phone(p.customer_info->>'phone')
          AND e.category_id = 'quote-requests'
          AND e.status = 'enrolled'
      )
  LOOP
    BEGIN
      PERFORM public.sms_crm_enroll_contact(
        r.phone,
        'quote-requests',
        r.name,
        r.email,
        'quote_backfill',
        r.id::text
      );
    EXCEPTION
      WHEN OTHERS THEN
        RAISE WARNING 'quote enroll backfill failed for %: %', r.id, SQLERRM;
    END;
  END LOOP;
END;
$$;
