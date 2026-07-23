-- Align booking/prebooking JSON payloads with Local Moving + Mattress form updates.
-- Data remains in existing JSONB columns; this migration documents the contract
-- and tightens validation for dual-address moving jobs.

COMMENT ON COLUMN public.bookings.booking_details IS
  'Service JSON:
   Common: service_type, preferred_date (YYYY-MM-DD), preferred_time, details,
           estimated_items[], estimated_volume, price, estimate_summary,
           photo_url, photo_urls[], deposit_amount, deposit_paid,
           stripe_payment_intent_id, terms_accepted_at,
           online_booking_discount, subtotal
   Moving Labor: moving_options {
     service_scope (both|loading|unloading|rearrange), needs_truck, home_size,
     access_type, flights_of_stairs, heavy_items[], needs_packing_help,
     needs_disassembly, helpers, hours, pickup_access, pickup_flights,
     dropoff_access, dropoff_flights
   }
   Mattress Disposal: items[{name,quantity}], online_booking_discount';

COMMENT ON COLUMN public.bookings.location_info IS
  'Location JSON:
   Common: address, unit_number, city, state, zip_code
   Moving Labor: access, flights_of_stairs;
     when dual-address (service_scope=both): address_b, unit_number_b, city_b,
     state_b, zip_code_b, access_b, flights_of_stairs_b';

COMMENT ON COLUMN public."Prebooking".booking_details IS
  'Partial booking JSON; may include moving_options, mattress items,
   estimate fields, and photo_url before conversion.';

CREATE OR REPLACE FUNCTION public.validate_booking_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_service text := lower(coalesce(NEW.booking_details->>'service_type', ''));
  v_deposit_paid text := lower(coalesce(NEW.booking_details->>'deposit_paid', ''));
  v_moving jsonb := NEW.booking_details->'moving_options';
  v_scope text := lower(coalesce(v_moving->>'service_scope', 'both'));
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

  -- Local Moving / Moving Labor: dual address required for full load & unload.
  IF (v_service LIKE '%moving%' OR v_service = 'moving labor')
     AND v_moving IS NOT NULL
     AND v_scope = 'both'
     AND coalesce(trim(NEW.location_info->>'address_b'), '') = '' THEN
    RAISE EXCEPTION 'drop-off address (address_b) is required for load & unload moving bookings'
      USING ERRCODE = '23514';
  END IF;

  -- Mattress: require at least one item in items[] or estimated_items[].
  IF v_service LIKE '%mattress%' THEN
    IF coalesce(jsonb_array_length(NEW.booking_details->'items'), 0) = 0
       AND coalesce(jsonb_array_length(NEW.booking_details->'estimated_items'), 0) = 0 THEN
      RAISE EXCEPTION 'items are required for mattress disposal bookings'
        USING ERRCODE = '23514';
    END IF;
  END IF;

  IF v_deposit_paid IN ('true', 't', '1')
     AND coalesce(trim(NEW.booking_details->>'stripe_payment_intent_id'), '') = '' THEN
    RAISE EXCEPTION 'stripe_payment_intent_id is required when deposit_paid is true'
      USING ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$;

-- Keep moving labor pricing config in sync with app fallback rates.
INSERT INTO public.pricing_config (key, value, description) VALUES
(
  'moving_labor_rules',
  '{"price_per_hour_2_helpers": 149, "price_per_hour_3_helpers": 189}',
  'Pricing variables for moving labor / local moving (hourly rates by helper count)'
),
(
  'mattress_disposal_rules',
  '{
    "standard_rates": {"one_item": 169, "two_items": 209, "three_or_more": 269},
    "online_discount": {"one_item": 31, "two_items": 40, "three_or_more": 42},
    "unit_prices": {"mattress": 105, "boxspring": 66, "bedframe": 72, "extra_default": 50}
  }',
  'Flat-rate mattress disposal pricing and online booking discounts'
)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = now();
