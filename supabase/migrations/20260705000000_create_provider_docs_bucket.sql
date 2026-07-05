-- Create provider-docs storage bucket for provider signup vehicle photos and insurance documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('provider-docs', 'provider-docs', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Clean up existing policies if any
DROP POLICY IF EXISTS "Allow public uploads to provider-docs" ON storage.objects;
DROP POLICY IF EXISTS "Allow public select from provider-docs" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to provider-docs" ON storage.objects;

-- Create public upload, read, and update policies
CREATE POLICY "Allow public uploads to provider-docs"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'provider-docs');

CREATE POLICY "Allow public select from provider-docs"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'provider-docs');

CREATE POLICY "Allow public updates to provider-docs"
ON storage.objects FOR UPDATE TO public
USING (bucket_id = 'provider-docs');