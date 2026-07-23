-- Reduce junk removal catalog pricing by 20%

UPDATE public.pricing_items
SET
  min_price = CASE
    WHEN min_price IS NOT NULL THEN GREATEST(1, ROUND(min_price * 0.8))
    ELSE NULL
  END,
  max_price = CASE
    WHEN max_price IS NOT NULL THEN GREATEST(1, ROUND(max_price * 0.8))
    ELSE NULL
  END;

UPDATE public.pricing_config
SET
  value = jsonb_set(
    jsonb_set(
      jsonb_set(value, '{min_price}', '135'::jsonb),
      '{base_price}', '48'::jsonb
    ),
    '{price_per_yard}', '48'::jsonb
  ),
  updated_at = now()
WHERE key = 'junk_removal_rules';
