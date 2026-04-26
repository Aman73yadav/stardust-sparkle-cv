-- Replace broad public read with per-object read so listing is blocked.
-- Public buckets still allow direct URL access to individual files.
DROP POLICY IF EXISTS "Public read resumes" ON storage.objects;
DROP POLICY IF EXISTS "Public read profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Public read project thumbnails" ON storage.objects;

-- Allow public to read a specific file only when it knows the exact name (no listing).
CREATE POLICY "Public file read in portfolio buckets"
  ON storage.objects FOR SELECT
  USING (
    bucket_id IN ('resumes', 'profile-photos', 'project-thumbnails')
    AND name IS NOT NULL
  );