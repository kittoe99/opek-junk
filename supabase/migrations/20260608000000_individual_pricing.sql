-- Rename min_price_override to min_price, and max_price_override to max_price
ALTER TABLE public.pricing_items RENAME COLUMN min_price_override TO min_price;
ALTER TABLE public.pricing_items RENAME COLUMN max_price_override TO max_price;

-- Update pricing_items with premium (upper-mid to high-end) individual prices
-- Furniture
UPDATE public.pricing_items SET min_price = 150, max_price = 250 WHERE name = 'sofa / couch';
UPDATE public.pricing_items SET min_price = 250, max_price = 450 WHERE name = 'sectional';
UPDATE public.pricing_items SET min_price = 120, max_price = 180 WHERE name = 'loveseat';
UPDATE public.pricing_items SET min_price = 80, max_price = 120 WHERE name = 'chair';
UPDATE public.pricing_items SET min_price = 95, max_price = 150 WHERE name = 'recliner';
UPDATE public.pricing_items SET min_price = 60, max_price = 90 WHERE name = 'ottoman';
UPDATE public.pricing_items SET min_price = 90, max_price = 140 WHERE name = 'table';
UPDATE public.pricing_items SET min_price = 120, max_price = 180 WHERE name = 'dining table';
UPDATE public.pricing_items SET min_price = 70, max_price = 110 WHERE name = 'coffee table';
UPDATE public.pricing_items SET min_price = 95, max_price = 150 WHERE name = 'tv stand / entertainment center';
UPDATE public.pricing_items SET min_price = 85, max_price = 130 WHERE name = 'bookshelf';
UPDATE public.pricing_items SET min_price = 95, max_price = 150 WHERE name = 'desk';
UPDATE public.pricing_items SET min_price = 80, max_price = 120 WHERE name = 'filing cabinet';
UPDATE public.pricing_items SET min_price = 110, max_price = 180 WHERE name = 'dresser';
UPDATE public.pricing_items SET min_price = 60, max_price = 90 WHERE name = 'nightstand';
UPDATE public.pricing_items SET min_price = 160, max_price = 260 WHERE name = 'wardrobe / armoire';
UPDATE public.pricing_items SET min_price = 180, max_price = 280 WHERE name = 'china cabinet';
UPDATE public.pricing_items SET min_price = 180, max_price = 300 WHERE name = 'patio furniture set';

-- Mattresses & Bedding
UPDATE public.pricing_items SET min_price = 120, max_price = 190 WHERE name = 'mattress';
UPDATE public.pricing_items SET min_price = 80, max_price = 120 WHERE name = 'box spring';
UPDATE public.pricing_items SET min_price = 80, max_price = 130 WHERE name = 'bed frame';
UPDATE public.pricing_items SET min_price = 110, max_price = 170 WHERE name = 'futon';
UPDATE public.pricing_items SET min_price = 180, max_price = 280 WHERE name = 'bunk bed';
UPDATE public.pricing_items SET min_price = 80, max_price = 120 WHERE name = 'crib';

-- Appliances
UPDATE public.pricing_items SET min_price = 150, max_price = 250 WHERE name = 'refrigerator / freezer';
UPDATE public.pricing_items SET min_price = 75, max_price = 120 WHERE name = 'mini fridge';
UPDATE public.pricing_items SET min_price = 200, max_price = 350 WHERE name = 'washer / dryer';
UPDATE public.pricing_items SET min_price = 110, max_price = 180 WHERE name = 'washing machine';
UPDATE public.pricing_items SET min_price = 110, max_price = 180 WHERE name = 'dryer';
UPDATE public.pricing_items SET min_price = 90, max_price = 150 WHERE name = 'dishwasher';
UPDATE public.pricing_items SET min_price = 110, max_price = 180 WHERE name = 'oven / stove';
UPDATE public.pricing_items SET min_price = 50, max_price = 80 WHERE name = 'microwave';
UPDATE public.pricing_items SET min_price = 70, max_price = 120 WHERE name = 'ac unit';
UPDATE public.pricing_items SET min_price = 120, max_price = 200 WHERE name = 'water heater';
UPDATE public.pricing_items SET min_price = 45, max_price = 75 WHERE name = 'vacuum cleaner';
UPDATE public.pricing_items SET min_price = 120, max_price = 220 WHERE name = 'exercise equipment';
UPDATE public.pricing_items SET min_price = 140, max_price = 240 WHERE name = 'treadmill';

-- Electronics
UPDATE public.pricing_items SET min_price = 70, max_price = 130 WHERE name = 'tv';
UPDATE public.pricing_items SET min_price = 60, max_price = 100 WHERE name = 'computer / monitor';
UPDATE public.pricing_items SET min_price = 50, max_price = 90 WHERE name = 'printer / scanner';
UPDATE public.pricing_items SET min_price = 50, max_price = 90 WHERE name = 'stereo / speakers';
UPDATE public.pricing_items SET min_price = 40, max_price = 70 WHERE name = 'gaming console';
UPDATE public.pricing_items SET min_price = 50, max_price = 80 WHERE name = 'electronics box';

-- Yard & Outdoor
UPDATE public.pricing_items SET min_price = 95, max_price = 150 WHERE name = 'lawn mower';
UPDATE public.pricing_items SET min_price = 180, max_price = 300 WHERE name = 'riding mower';
UPDATE public.pricing_items SET min_price = 85, max_price = 140 WHERE name = 'grill / bbq';
UPDATE public.pricing_items SET min_price = 190, max_price = 350 WHERE name = 'trampoline';
UPDATE public.pricing_items SET min_price = 250, max_price = 500 WHERE name = 'swing set / playground';
UPDATE public.pricing_items SET min_price = 350, max_price = 650 WHERE name = 'hot tub / spa';
UPDATE public.pricing_items SET min_price = 400, max_price = 800 WHERE name = 'shed';
UPDATE public.pricing_items SET min_price = 120, max_price = 220 WHERE name = 'fencing';
UPDATE public.pricing_items SET min_price = 80, max_price = 140 WHERE name = 'yard debris / brush';
UPDATE public.pricing_items SET min_price = 45, max_price = 75 WHERE name = 'garden tools';
UPDATE public.pricing_items SET min_price = 90, max_price = 160 WHERE name = 'firewood pile';

-- Construction & Debris
UPDATE public.pricing_items SET min_price = 95, max_price = 170 WHERE name = 'drywall / sheetrock';
UPDATE public.pricing_items SET min_price = 90, max_price = 160 WHERE name = 'lumber / wood';
UPDATE public.pricing_items SET min_price = 110, max_price = 190 WHERE name = 'carpet / padding';
UPDATE public.pricing_items SET min_price = 110, max_price = 190 WHERE name = 'tile / flooring';
UPDATE public.pricing_items SET min_price = 140, max_price = 250 WHERE name = 'concrete / brick';
UPDATE public.pricing_items SET min_price = 120, max_price = 220 WHERE name = 'roofing shingles';
UPDATE public.pricing_items SET min_price = 80, max_price = 140 WHERE name = 'windows / doors';
UPDATE public.pricing_items SET min_price = 150, max_price = 260 WHERE name = 'cabinets / countertop';
UPDATE public.pricing_items SET min_price = 90, max_price = 150 WHERE name = 'plumbing fixtures';
UPDATE public.pricing_items SET min_price = 50, max_price = 90 WHERE name = 'paint cans';
UPDATE public.pricing_items SET min_price = 80, max_price = 130 WHERE name = 'insulation';

-- Garage & Storage
UPDATE public.pricing_items SET min_price = 20, max_price = 40 WHERE name = 'tires';
UPDATE public.pricing_items SET min_price = 45, max_price = 75 WHERE name = 'car battery';
UPDATE public.pricing_items SET min_price = 65, max_price = 110 WHERE name = 'bicycle';
UPDATE public.pricing_items SET min_price = 110, max_price = 190 WHERE name = 'toolbox / workbench';
UPDATE public.pricing_items SET min_price = 80, max_price = 130 WHERE name = 'shelving unit';
UPDATE public.pricing_items SET min_price = 50, max_price = 85 WHERE name = 'storage bins / boxes';
UPDATE public.pricing_items SET min_price = 45, max_price = 75 WHERE name = 'clothing / bags';
UPDATE public.pricing_items SET min_price = 45, max_price = 75 WHERE name = 'luggage';
UPDATE public.pricing_items SET min_price = 50, max_price = 85 WHERE name = 'sports equipment';
UPDATE public.pricing_items SET min_price = 45, max_price = 70 WHERE name = 'kids toys';

-- Miscellaneous
UPDATE public.pricing_items SET min_price = 250, max_price = 500 WHERE name = 'piano / organ';
UPDATE public.pricing_items SET min_price = 180, max_price = 300 WHERE name = 'pool / game table';
UPDATE public.pricing_items SET min_price = 80, max_price = 140 WHERE name = 'aquarium / fish tank';
UPDATE public.pricing_items SET min_price = 60, max_price = 100 WHERE name = 'rug';
UPDATE public.pricing_items SET min_price = 50, max_price = 90 WHERE name = 'mirror';
UPDATE public.pricing_items SET min_price = 45, max_price = 75 WHERE name = 'light fixture';
UPDATE public.pricing_items SET min_price = 40, max_price = 70 WHERE name = 'bags of trash';
UPDATE public.pricing_items SET min_price = 40, max_price = 70 WHERE name = 'boxes of junk';
UPDATE public.pricing_items SET min_price = 60, max_price = 100 WHERE name = 'miscellaneous item';
