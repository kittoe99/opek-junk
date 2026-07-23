-- Migration: Security hardening
-- Fixes:
--   1. bookings was anonymously readable (full customer PII dump). Remove the
--      "SELECT USING (true)" policy and expose tracking through a tightly-scoped,
--      exact-match SECURITY DEFINER function instead.
--   2. Prebooking was anonymously readable AND updatable by anyone. Remove the
--      public SELECT/UPDATE policies and route create/update through SECURITY
--      DEFINER functions so callers can only act on a row by its (unguessable) id.
--   3. order_status_history was directly readable by anon. Route through a function.
--   4. booking-photos storage allowed anyone to overwrite any object. Remove the
--      public UPDATE policy.

-- ---------------------------------------------------------------------------
-- 1. bookings: drop the anonymous read-all policy
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow anonymous read for tracking" ON public.bookings;

-- Exact-match order tracking. Returns a row only when the caller supplies an
-- exact order number or the exact (digits-only) phone number, preventing bulk
-- enumeration of the table.
CREATE OR REPLACE FUNCTION public.track_order(
  p_search_type text,
  p_search_value text
)
RETURNS TABLE (
  id uuid,
  order_number text,
  customer_info jsonb,
  location_info jsonb,
  booking_details jsonb,
  status text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_search_value IS NULL OR length(trim(p_search_value)) = 0 THEN
    RETURN;
  END IF;

  IF p_search_type = 'order' THEN
    RETURN QUERY
      SELECT b.id, b.order_number, b.customer_info, b.location_info,
             b.booking_details, b.status, b.created_at
      FROM public.bookings b
      WHERE b.order_number = upper(trim(p_search_value))
      ORDER BY b.created_at DESC
      LIMIT 10;
  ELSIF p_search_type = 'phone' THEN
    RETURN QUERY
      SELECT b.id, b.order_number, b.customer_info, b.location_info,
             b.booking_details, b.status, b.created_at
      FROM public.bookings b
      WHERE regexp_replace(coalesce(b.customer_info->>'phone', ''), '\D', '', 'g')
            = regexp_replace(p_search_value, '\D', '', 'g')
        AND length(regexp_replace(p_search_value, '\D', '', 'g')) >= 7
      ORDER BY b.created_at DESC
      LIMIT 10;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.track_order(text, text) FROM public;
GRANT EXECUTE ON FUNCTION public.track_order(text, text) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. order_status_history: block direct anon reads, expose via function
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_order_status_history(p_booking_id uuid)
RETURNS TABLE (
  id uuid,
  status text,
  note text,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT h.id, h.status, h.note, h.created_at
  FROM public.order_status_history h
  WHERE h.booking_id = p_booking_id
  ORDER BY h.created_at ASC;
$$;

REVOKE ALL ON FUNCTION public.get_order_status_history(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_order_status_history(uuid) TO anon, authenticated;

DROP POLICY IF EXISTS "Allow anonymous read" ON public.order_status_history;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.order_status_history;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'order_status_history'
  ) THEN
    EXECUTE 'ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE SELECT, INSERT, UPDATE, DELETE ON public.order_status_history FROM anon';
  END IF;
END;
$$;

-- ---------------------------------------------------------------------------
-- 3. Prebooking: remove public read/update, expose create/update via functions
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public select for Prebooking" ON public."Prebooking";
DROP POLICY IF EXISTS "Allow public update for Prebooking" ON public."Prebooking";

CREATE OR REPLACE FUNCTION public.create_prebooking(
  p_customer_info jsonb DEFAULT '{}'::jsonb,
  p_booking_details jsonb DEFAULT '{}'::jsonb,
  p_status text DEFAULT 'partially_submitted'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO public."Prebooking" (customer_info, booking_details, status)
  VALUES (
    coalesce(p_customer_info, '{}'::jsonb),
    coalesce(p_booking_details, '{}'::jsonb),
    coalesce(p_status, 'partially_submitted')
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_prebooking(jsonb, jsonb, text) FROM public;
GRANT EXECUTE ON FUNCTION public.create_prebooking(jsonb, jsonb, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.update_prebooking(
  p_id uuid,
  p_customer_info jsonb DEFAULT NULL,
  p_booking_details jsonb DEFAULT NULL,
  p_status text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_id IS NULL THEN
    RETURN;
  END IF;

  UPDATE public."Prebooking"
  SET customer_info   = coalesce(p_customer_info, customer_info),
      booking_details = coalesce(p_booking_details, booking_details),
      status          = coalesce(p_status, status)
  WHERE id = p_id;
END;
$$;

REVOKE ALL ON FUNCTION public.update_prebooking(uuid, jsonb, jsonb, text) FROM public;
GRANT EXECUTE ON FUNCTION public.update_prebooking(uuid, jsonb, jsonb, text) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. booking-photos storage: remove the public UPDATE (overwrite) policy
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public updates to booking-photos" ON storage.objects;
