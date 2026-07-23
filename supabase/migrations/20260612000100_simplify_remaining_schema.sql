-- Migration: Simplify contacts, provider_signups, schedule_visits, and in_home_estimates tables to use JSONB columns

-- 1. Drop existing tables with CASCADE
DROP TABLE IF EXISTS public.contacts CASCADE;
DROP TABLE IF EXISTS public.provider_signups CASCADE;
DROP TABLE IF EXISTS public.schedule_visits CASCADE;
DROP TABLE IF EXISTS public.in_home_estimates CASCADE;

-- 2. Create revamped contacts table
CREATE TABLE public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_info JSONB NOT NULL DEFAULT '{}'::jsonb,
    contact_info JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS and create policies for contacts
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" 
    ON public.contacts FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated reads" 
    ON public.contacts FOR SELECT USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS contacts_customer_phone_idx ON public.contacts ((customer_info->>'phone'));


-- 3. Create revamped provider_signups table
CREATE TABLE public.provider_signups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_info JSONB NOT NULL DEFAULT '{}'::jsonb,
    provider_info JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS and create policies for provider_signups
ALTER TABLE public.provider_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" 
    ON public.provider_signups FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated reads" 
    ON public.provider_signups FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated updates" 
    ON public.provider_signups FOR UPDATE USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS provider_signups_customer_phone_idx ON public.provider_signups ((customer_info->>'phone'));


-- 4. Create revamped schedule_visits table
CREATE TABLE public.schedule_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_info JSONB NOT NULL DEFAULT '{}'::jsonb,
    location_info JSONB NOT NULL DEFAULT '{}'::jsonb,
    visit_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS and create policies for schedule_visits
ALTER TABLE public.schedule_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" 
    ON public.schedule_visits FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated reads" 
    ON public.schedule_visits FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated updates" 
    ON public.schedule_visits FOR UPDATE USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS schedule_visits_customer_phone_idx ON public.schedule_visits ((customer_info->>'phone'));


-- 5. Create revamped in_home_estimates table
CREATE TABLE public.in_home_estimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_info JSONB NOT NULL DEFAULT '{}'::jsonb,
    location_info JSONB NOT NULL DEFAULT '{}'::jsonb,
    estimate_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS and create policies for in_home_estimates
ALTER TABLE public.in_home_estimates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_public_insert_in_home_estimates" 
    ON public.in_home_estimates FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS in_home_estimates_customer_phone_idx ON public.in_home_estimates ((customer_info->>'phone'));
