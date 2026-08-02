-- Phone order lookups must go through SMS OTP (lookup-quote-otp purpose=track_order).
-- track_order remains for confirmation-number searches only.

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

  -- Order number only. Phone search is handled by the OTP edge function.
  IF p_search_type = 'order' THEN
    RETURN QUERY
      SELECT b.id, b.order_number, b.customer_info, b.location_info,
             b.booking_details, b.status, b.created_at
      FROM public.bookings b
      WHERE b.order_number = upper(trim(p_search_value))
      ORDER BY b.created_at DESC
      LIMIT 10;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.track_order(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.track_order(text, text) TO anon, authenticated;
