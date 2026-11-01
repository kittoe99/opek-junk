-- Populate pricing_items with more catalog items
INSERT INTO public.pricing_items (name, category, volume, min_price, max_price) VALUES
('desk chair / office chair', 'Furniture', 0.5, 45, 75),
('bar stools', 'Furniture', 0.3, 30, 55),
('patio chair', 'Furniture', 0.5, 40, 70),
('futon mattress', 'Mattresses & Bedding', 1.0, 60, 95),
('dehumidifier', 'Appliances', 0.3, 40, 65),
('water dispenser / cooler', 'Appliances', 0.8, 60, 95),
('speakers (large)', 'Electronics', 0.8, 60, 95),
('projector', 'Electronics', 0.2, 30, 55),
('wheelbarrow', 'Yard & Outdoor', 0.8, 45, 75),
('leaf blower', 'Yard & Outdoor', 0.2, 30, 50),
('ladder', 'Garage & Storage', 0.5, 40, 70),
('metal shelving', 'Garage & Storage', 1.0, 55, 90),
('safe (medium/large)', 'Miscellaneous', 1.5, 150, 280),
('pet crate / kennel', 'Miscellaneous', 0.8, 40, 75),
('stroller', 'Miscellaneous', 0.5, 35, 60)
ON CONFLICT (name) DO UPDATE SET 
    category = EXCLUDED.category, 
    volume = EXCLUDED.volume, 
    min_price = EXCLUDED.min_price, 
    max_price = EXCLUDED.max_price;
