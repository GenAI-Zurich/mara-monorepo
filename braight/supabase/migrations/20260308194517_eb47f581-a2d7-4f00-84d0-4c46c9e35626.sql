CREATE POLICY "Allow public uploads to pim bucket"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'pim');

CREATE POLICY "Allow public update in pim bucket"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'pim')
WITH CHECK (bucket_id = 'pim');