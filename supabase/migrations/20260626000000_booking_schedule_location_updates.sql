-- Document JSONB fields used by the booking/quote UI updates (preferred_time, structured address).
-- No new columns required — data is stored inside existing JSONB payloads.

COMMENT ON COLUMN public.bookings.booking_details IS
  'Service details JSON: service_type, preferred_date (YYYY-MM-DD), preferred_time (Morning|Mid-day|Evening), details, estimated_items, price, etc.';

COMMENT ON COLUMN public.bookings.location_info IS
  'Service location JSON: address, unit_number, city, state, zip_code (validated US address from autocomplete).';

COMMENT ON COLUMN public."Prebooking".booking_details IS
  'Partial booking JSON; may include preferred_date and preferred_time before full submission.';

COMMENT ON COLUMN public.in_home_estimates.location_info IS
  'Estimate location JSON: address, unit_number, city, state, zip_code.';

-- Keep pricing_config aligned with local fallback rates used when edge/API pricing is unavailable.
INSERT INTO public.pricing_config (key, value, description) VALUES
(
  'junk_removal_rules',
  '{"base_price": 60, "price_per_yard": 60, "min_price": 169}',
  'Base pricing variables for junk removal volume calculation'
),
(
  'dumpster_rental_rules',
  '{
    "base_prices": {"10-yard": 350, "15-yard": 400, "20-yard": 450, "30-yard": 550},
    "base_duration_days": 7,
    "extra_day_price": 25,
    "discount_days_threshold": 14,
    "discount_percent": 10
  }',
  'Pricing variables for dumpster rental calculations'
),
(
  'moving_labor_rules',
  '{"price_per_hour_2_helpers": 149, "price_per_hour_3_helpers": 189}',
  'Pricing variables for moving labor calculations (hourly rates)'
)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = now();
