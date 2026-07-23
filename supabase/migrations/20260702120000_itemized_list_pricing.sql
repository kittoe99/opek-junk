-- Optional: add explicit per-item list prices. Until populated, the app uses
-- ROUND((min_price + max_price) / 2) from pricing_items.

ALTER TABLE public.pricing_items
  ADD COLUMN IF NOT EXISTS list_price INTEGER;

UPDATE public.pricing_items
SET list_price = ROUND((min_price + max_price) / 2.0)
WHERE list_price IS NULL
  AND min_price IS NOT NULL
  AND max_price IS NOT NULL;

UPDATE public.pricing_config
SET
  value = jsonb_set(
    COALESCE(value, '{}'::jsonb),
    '{min_price}',
    '135'::jsonb
  ),
  description = 'Junk removal job minimum. Per-item prices live in pricing_items (min_price, max_price, optional list_price).',
  updated_at = now()
WHERE key = 'junk_removal_rules';
