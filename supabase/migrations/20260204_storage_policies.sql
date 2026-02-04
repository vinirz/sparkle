-- Create bucket for question images (run this in Supabase SQL Editor or Dashboard)
INSERT INTO storage.buckets (id, name, public)
VALUES ('question-images', 'question-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload question images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'question-images');

-- Allow authenticated users to update their own images
CREATE POLICY "Authenticated users can update question images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'question-images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete question images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'question-images');

-- Allow public read access to images
CREATE POLICY "Public read access for question images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'question-images');
