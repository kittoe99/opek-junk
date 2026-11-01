-- Migration: Security hardening round 2
-- Fixes:
--   1. Any signed-in user could read/update all customer PII (bookings, contacts, payments, etc.)
--   2. Internal SECURITY DEFINER trigger functions were callable via PostgREST RPC
--   3. get_order_status_history allowed IDOR via booking UUID without ownership proof
--   4. check_ai_rate_limit allowed anon callers to manipulate any user's rate limit
--   5. Prebooking allowed direct table INSERT bypassing the controlled RPC path
--   6. ai_chat_rate_limits and order_status_history had RLS enabled but no policies
--   7. booking-photos bucket allowed listing all customer photos
--   8. websites storage bucket allowed any authenticated user to modify/delete any object

-- ---------------------------------------------------------------------------
-- 1. Remove overly broad authenticated policies (admin uses service_role)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow authenticated reads" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated updates" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated reads" ON public.contacts;
DROP POLICY IF EXISTS "Allow authenticated reads" ON public.provider_signups;
DROP POLICY IF EXISTS "Allow authenticated updates" ON public.provider_signups;
DROP POLICY IF EXISTS "Allow authenticated reads" ON public.schedule_visits;
DROP POLICY IF EXISTS "Allow authenticated updates" ON public.schedule_visits;
DROP POLICY IF EXISTS "Allow authenticated read for payments" ON public.payments;
DROP POLICY IF EXISTS "Allow authenticated read for stripe customers" ON public.stripe_customers;

REVOKE SELECT, UPDATE ON public.bookings FROM authenticated;
REVOKE SELECT, UPDATE ON public."Prebooking" FROM authenticated;
REVOKE SELECT ON public.contacts FROM authenticated;
REVOKE SELECT, UPDATE ON public.provider_signups FROM authenticated;
REVOKE SELECT, UPDATE ON public.schedule_visits FROM authenticated;
REVOKE SELECT ON public.in_home_estimates FROM authenticated;
REVOKE SELECT, UPDATE ON public.payments FROM authenticated;
REVOKE SELECT, UPDATE ON public.stripe_customers FROM authenticated;
REVOKE SELECT ON public.stripe_webhook_events FROM authenticated;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.order_status_history FROM authenticated;

-- ---------------------------------------------------------------------------
-- 2. Prebooking: route writes through SECURITY DEFINER RPCs only
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public insert for Prebooking" ON public."Prebooking";

REVOKE INSERT, UPDATE, DELETE ON public."Prebooking" FROM anon;

CREATE POLICY "Deny direct client access to Prebooking"
    ON public."Prebooking" FOR ALL
    USING (false)
    WITH CHECK (false);

-- ---------------------------------------------------------------------------
-- 3. payments / stripe_customers: service_role only
-- ---------------------------------------------------------------------------
CREATE POLICY "Deny client access to payments"
    ON public.payments FOR ALL
    USING (false)
    WITH CHECK (false);

CREATE POLICY "Deny client access to stripe_customers"
    ON public.stripe_customers FOR ALL
    USING (false)
    WITH CHECK (false);

REVOKE ALL ON public.payments FROM anon, authenticated;
REVOKE ALL ON public.stripe_customers FROM anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. ai_chat_rate_limits: deny direct client access; lock down rate-limit RPC
-- ---------------------------------------------------------------------------
CREATE POLICY "Deny client access to ai_chat_rate_limits"
    ON public.ai_chat_rate_limits FOR ALL
    USING (false)
    WITH CHECK (false);

REVOKE ALL ON public.ai_chat_rate_limits FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.check_ai_rate_limit(
  p_user_id uuid,
  p_max_per_hour integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window TIMESTAMPTZ := date_trunc('hour', now());
  v_count INTEGER;
BEGIN
  IF auth.uid() IS NULL OR p_user_id IS DISTINCT FROM auth.uid() THEN
    RETURN false;
  END IF;

  INSERT INTO ai_chat_rate_limits AS r (user_id, window_start, request_count)
  VALUES (p_user_id, v_window, 1)
  ON CONFLICT (user_id) DO UPDATE SET
    request_count = CASE
      WHEN r.window_start = v_window THEN r.request_count + 1
      ELSE 1
    END,
    window_start = CASE
      WHEN r.window_start = v_window THEN r.window_start
      ELSE v_window
    END
  RETURNING request_count INTO v_count;

  RETURN v_count <= p_max_per_hour;
END;
$$;

REVOKE ALL ON FUNCTION public.check_ai_rate_limit(uuid, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_ai_rate_limit(uuid, integer) TO authenticated;

-- ---------------------------------------------------------------------------
-- 5. order_status_history: explicit deny + IDOR-safe history lookup
-- ---------------------------------------------------------------------------
CREATE POLICY "Deny client access to order_status_history"
    ON public.order_status_history FOR ALL
    USING (false)
    WITH CHECK (false);

DROP FUNCTION IF EXISTS public.get_order_status_history(uuid);

CREATE OR REPLACE FUNCTION public.get_order_status_history(
  p_booking_id uuid,
  p_search_type text,
  p_search_value text
)
RETURNS TABLE (
  id uuid,
  status text,
  note text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_booking_id IS NULL
     OR p_search_value IS NULL
     OR length(trim(p_search_value)) = 0
  THEN
    RETURN;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.bookings b
    WHERE b.id = p_booking_id
      AND (
        (p_search_type = 'order'
         AND b.order_number = upper(trim(p_search_value)))
        OR (
          p_search_type = 'phone'
          AND regexp_replace(coalesce(b.customer_info->>'phone', ''), '\D', '', 'g')
              = regexp_replace(p_search_value, '\D', '', 'g')
          AND length(regexp_replace(p_search_value, '\D', '', 'g')) >= 7
        )
      )
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
    SELECT h.id, h.status, h.note, h.created_at
    FROM public.order_status_history h
    WHERE h.booking_id = p_booking_id
    ORDER BY h.created_at ASC;
END;
$$;

REVOKE ALL ON FUNCTION public.get_order_status_history(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_order_status_history(uuid, text, text) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 6. Revoke RPC access to internal trigger-only SECURITY DEFINER functions
-- ---------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.link_payment_to_booking() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.notify_form_submission() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.trigger_send_form_notification() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.trigger_send_payment_receipt() FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 7. booking-photos: stop bucket-wide listing (direct URLs still work)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public select from booking-photos" ON storage.objects;

-- ---------------------------------------------------------------------------
-- 8. websites bucket: scope mutations to owner folder (matches deployed-sites)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "websites_authenticated_delete" ON storage.objects;
DROP POLICY IF EXISTS "websites_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "websites_authenticated_upload" ON storage.objects;

CREATE POLICY "websites_authenticated_upload"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
      bucket_id = 'websites'
      AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "websites_authenticated_update"
    ON storage.objects FOR UPDATE TO authenticated
    USING (
      bucket_id = 'websites'
      AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "websites_authenticated_delete"
    ON storage.objects FOR DELETE TO authenticated
    USING (
      bucket_id = 'websites'
      AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- ---------------------------------------------------------------------------
-- 9. Fix mutable search_path on booking-domain trigger functions
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.link_payment_to_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.payments
    SET booking_id = NEW.id,
        updated_at = now()
    WHERE stripe_payment_intent_id = NEW.booking_details->>'stripe_payment_intent_id'
      AND booking_id IS NULL;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_order_number text;
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  i int;
  code text;
BEGIN
  LOOP
    code := '';
    FOR i IN 1..6 LOOP
      code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    new_order_number := 'OPK-' || code;
    PERFORM 1 FROM public.bookings WHERE order_number = new_order_number;
    IF NOT FOUND THEN
      NEW.order_number := new_order_number;
      EXIT;
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$;
