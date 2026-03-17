CREATE POLICY "Allow public select in pim bucket"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'pim');

CREATE POLICY "Allow public delete in pim bucket"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'pim');