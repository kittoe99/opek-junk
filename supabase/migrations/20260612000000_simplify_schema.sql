-- Migration: Simplify bookings and Prebooking tables to use JSONB columns

-- 1. Drop existing tables with CASCADE to automatically drop dependent foreign keys
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public."Prebooking" CASCADE;

-- 2. Create revamped bookings table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_info JSONB NOT NULL DEFAULT '{}'::jsonb,
    location_info JSONB NOT NULL DEFAULT '{}'::jsonb,
    booking_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings
CREATE POLICY "Allow anonymous read for tracking" 
    ON public.bookings FOR SELECT USING (true);

CREATE POLICY "Allow public inserts" 
    ON public.bookings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated reads" 
    ON public.bookings FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated updates" 
    ON public.bookings FOR UPDATE USING (auth.role() = 'authenticated');

-- Create functional index for phone number lookup (frequently used by TrackOrderPage.tsx)
CREATE INDEX IF NOT EXISTS bookings_customer_phone_idx ON public.bookings ((customer_info->>'phone'));

-- 3. Create revamped Prebooking table
CREATE TABLE public."Prebooking" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_info JSONB NOT NULL DEFAULT '{}'::jsonb,
    booking_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'partially_submitted',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on Prebooking
ALTER TABLE public."Prebooking" ENABLE ROW LEVEL SECURITY;

-- Create policies for Prebooking
CREATE POLICY "Allow public select for Prebooking" 
    ON public."Prebooking" FOR SELECT USING (true);

CREATE POLICY "Allow public insert for Prebooking" 
    ON public."Prebooking" FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update for Prebooking" 
    ON public."Prebooking" FOR UPDATE USING (true);

-- 4. Re-establish foreign key on order_status_history table
TRUNCATE TABLE public.order_status_history CASCADE;

ALTER TABLE public.order_status_history
    ADD CONSTRAINT order_status_history_booking_id_fkey 
    FOREIGN KEY (booking_id) 
    REFERENCES public.bookings(id) 
    ON DELETE CASCADE;
