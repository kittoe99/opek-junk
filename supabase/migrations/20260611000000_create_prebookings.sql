-- Create Prebooking table
CREATE TABLE IF NOT EXISTS public."Prebooking" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT,
    phone TEXT,
    service_type TEXT,
    zip_code TEXT,
    estimated_items JSONB DEFAULT '[]'::jsonb,
    estimated_volume TEXT,
    price INTEGER,
    estimate_summary TEXT,
    photo_url TEXT,
    details TEXT,
    status TEXT DEFAULT 'partially_submitted',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on Prebooking
ALTER TABLE public."Prebooking" ENABLE ROW LEVEL SECURITY;

-- Create read-only select policy for Prebooking
CREATE POLICY "Allow public select for Prebooking" 
    ON public."Prebooking" 
    FOR SELECT 
    USING (true);

-- Create insert policy for Prebooking
CREATE POLICY "Allow public insert for Prebooking" 
    ON public."Prebooking" 
    FOR INSERT 
    WITH CHECK (true);

-- Create update policy for Prebooking
CREATE POLICY "Allow public update for Prebooking" 
    ON public."Prebooking" 
    FOR UPDATE 
    USING (true);
