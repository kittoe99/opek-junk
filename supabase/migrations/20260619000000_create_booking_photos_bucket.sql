-- Create booking-photos storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('booking-photos', 'booking-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Clean up existing policies if any
DROP POLICY IF EXISTS "Allow public uploads to booking-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public select from booking-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to booking-photos" ON storage.objects;

-- Create public upload, read, and update policies
CREATE POLICY "Allow public uploads to booking-photos"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'booking-photos');

CREATE POLICY "Allow public select from booking-photos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'booking-photos');

CREATE POLICY "Allow public updates to booking-photos"
ON storage.objects FOR UPDATE TO public
USING (bucket_id = 'booking-photos');
