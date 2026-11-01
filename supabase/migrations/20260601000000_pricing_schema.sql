-- Create pricing_items table
CREATE TABLE IF NOT EXISTS public.pricing_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    volume NUMERIC NOT NULL, -- volume in cubic yards (yd³)
    min_price_override INTEGER,
    max_price_override INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on pricing_items
ALTER TABLE public.pricing_items ENABLE ROW LEVEL SECURITY;

-- Create read-only select policy for pricing_items
CREATE POLICY "Allow public read access for pricing_items" 
    ON public.pricing_items 
    FOR SELECT 
    USING (true);

-- Create pricing_config table
CREATE TABLE IF NOT EXISTS public.pricing_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on pricing_config
ALTER TABLE public.pricing_config ENABLE ROW LEVEL SECURITY;

-- Create read-only select policy for pricing_config
CREATE POLICY "Allow public read access for pricing_config" 
    ON public.pricing_config 
    FOR SELECT 
    USING (true);

-- Insert pricing_config default settings
INSERT INTO public.pricing_config (key, value, description) VALUES
('junk_removal_rules', '{
    "base_price": 60,
    "price_per_yard": 60,
    "min_price": 169
}', 'Base pricing variables for junk removal volume calculation'),
('dumpster_rental_rules', '{
    "base_prices": {
        "10-yard": 350,
        "15-yard": 400,
        "20-yard": 450,
        "30-yard": 550
    },
    "base_duration_days": 7,
    "extra_day_price": 25,
    "discount_days_threshold": 14,
    "discount_percent": 10
}', 'Pricing variables for dumpster rental calculations'),
('moving_labor_rules', '{
    "price_per_hour_2_helpers": 149,
    "price_per_hour_3_helpers": 189
}', 'Pricing variables for moving labor calculations (hourly rates)')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Populate pricing_items
INSERT INTO public.pricing_items (name, category, volume, min_price_override, max_price_override) VALUES
-- Furniture
('sofa / couch', 'Furniture', 2.5, NULL, NULL),
('sectional', 'Furniture', 4.5, NULL, NULL),
('loveseat', 'Furniture', 2.0, NULL, NULL),
('chair', 'Furniture', 1.0, NULL, NULL),
('recliner', 'Furniture', 1.5, NULL, NULL),
('ottoman', 'Furniture', 0.5, NULL, NULL),
('table', 'Furniture', 1.5, NULL, NULL),
('dining table', 'Furniture', 2.0, NULL, NULL),
('coffee table', 'Furniture', 0.5, NULL, NULL),
('tv stand / entertainment center', 'Furniture', 2.0, NULL, NULL),
('bookshelf', 'Furniture', 1.5, NULL, NULL),
('desk', 'Furniture', 1.5, NULL, NULL),
('filing cabinet', 'Furniture', 1.0, NULL, NULL),
('dresser', 'Furniture', 1.5, NULL, NULL),
('nightstand', 'Furniture', 0.5, NULL, NULL),
('wardrobe / armoire', 'Furniture', 2.5, NULL, NULL),
('china cabinet', 'Furniture', 2.5, NULL, NULL),
('patio furniture set', 'Furniture', 3.0, NULL, NULL),

-- Mattresses & Bedding
('mattress', 'Mattresses & Bedding', 1.5, NULL, NULL),
('box spring', 'Mattresses & Bedding', 1.0, NULL, NULL),
('bed frame', 'Mattresses & Bedding', 1.0, NULL, NULL),
('futon', 'Mattresses & Bedding', 1.5, NULL, NULL),
('bunk bed', 'Mattresses & Bedding', 2.5, NULL, NULL),
('crib', 'Mattresses & Bedding', 1.0, NULL, NULL),

-- Appliances
('refrigerator / freezer', 'Appliances', 2.0, NULL, NULL),
('mini fridge', 'Appliances', 0.5, NULL, NULL),
('washer / dryer', 'Appliances', 1.0, NULL, NULL),
('washing machine', 'Appliances', 1.0, NULL, NULL),
('dryer', 'Appliances', 1.0, NULL, NULL),
('dishwasher', 'Appliances', 1.0, NULL, NULL),
('oven / stove', 'Appliances', 1.5, NULL, NULL),
('microwave', 'Appliances', 0.3, NULL, NULL),
('ac unit', 'Appliances', 0.5, NULL, NULL),
('water heater', 'Appliances', 1.0, NULL, NULL),
('vacuum cleaner', 'Appliances', 0.2, NULL, NULL),
('exercise equipment', 'Appliances', 2.0, NULL, NULL),
('treadmill', 'Appliances', 2.0, NULL, NULL),

-- Electronics
('tv', 'Electronics', 0.5, NULL, NULL),
('computer / monitor', 'Electronics', 0.2, NULL, NULL),
('printer / scanner', 'Electronics', 0.2, NULL, NULL),
('stereo / speakers', 'Electronics', 0.3, NULL, NULL),
('gaming console', 'Electronics', 0.1, NULL, NULL),
('electronics box', 'Electronics', 0.2, NULL, NULL),

-- Yard & Outdoor
('lawn mower', 'Yard & Outdoor', 0.8, NULL, NULL),
('riding mower', 'Yard & Outdoor', 2.0, NULL, NULL),
('grill / bbq', 'Yard & Outdoor', 1.0, NULL, NULL),
('trampoline', 'Yard & Outdoor', 3.0, NULL, NULL),
('swing set / playground', 'Yard & Outdoor', 4.0, NULL, NULL),
('hot tub / spa', 'Yard & Outdoor', 6.0, 300, 600),
('shed', 'Yard & Outdoor', 8.0, 300, 600),
('fencing', 'Yard & Outdoor', 2.0, NULL, NULL),
('yard debris / brush', 'Yard & Outdoor', 1.0, NULL, NULL),
('garden tools', 'Yard & Outdoor', 0.2, NULL, NULL),
('firewood pile', 'Yard & Outdoor', 1.0, NULL, NULL),

-- Construction & Debris
('drywall / sheetrock', 'Construction & Debris', 1.0, NULL, NULL),
('lumber / wood', 'Construction & Debris', 1.0, NULL, NULL),
('carpet / padding', 'Construction & Debris', 1.5, NULL, NULL),
('tile / flooring', 'Construction & Debris', 1.0, NULL, NULL),
('concrete / brick', 'Construction & Debris', 1.0, NULL, NULL),
('roofing shingles', 'Construction & Debris', 1.0, NULL, NULL),
('windows / doors', 'Construction & Debris', 1.0, NULL, NULL),
('cabinets / countertop', 'Construction & Debris', 2.0, NULL, NULL),
('plumbing fixtures', 'Construction & Debris', 1.0, NULL, NULL),
('paint cans', 'Construction & Debris', 0.2, NULL, NULL),
('insulation', 'Construction & Debris', 1.0, NULL, NULL),

-- Garage & Storage
('tires', 'Garage & Storage', 0.2, 10, 20),
('car battery', 'Garage & Storage', 0.1, NULL, NULL),
('bicycle', 'Garage & Storage', 0.5, NULL, NULL),
('toolbox / workbench', 'Garage & Storage', 1.5, NULL, NULL),
('shelving unit', 'Garage & Storage', 1.0, NULL, NULL),
('storage bins / boxes', 'Garage & Storage', 0.3, NULL, NULL),
('clothing / bags', 'Garage & Storage', 0.2, NULL, NULL),
('luggage', 'Garage & Storage', 0.2, NULL, NULL),
('sports equipment', 'Garage & Storage', 0.3, NULL, NULL),
('kids toys', 'Garage & Storage', 0.2, NULL, NULL),

-- Miscellaneous
('piano / organ', 'Miscellaneous', 3.0, 200, 400),
('pool / game table', 'Miscellaneous', 3.0, NULL, NULL),
('aquarium / fish tank', 'Miscellaneous', 1.0, NULL, NULL),
('rug', 'Miscellaneous', 0.5, NULL, NULL),
('mirror', 'Miscellaneous', 0.2, NULL, NULL),
('light fixture', 'Miscellaneous', 0.2, NULL, NULL),
('bags of trash', 'Miscellaneous', 0.2, NULL, NULL),
('boxes of junk', 'Miscellaneous', 0.2, NULL, NULL),
('miscellaneous item', 'Miscellaneous', 0.5, NULL, NULL)
ON CONFLICT (name) DO UPDATE SET 
    category = EXCLUDED.category, 
    volume = EXCLUDED.volume, 
    min_price_override = EXCLUDED.min_price_override, 
    max_price_override = EXCLUDED.max_price_override;

-- Ensure bookings table has price column
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS price INTEGER;
