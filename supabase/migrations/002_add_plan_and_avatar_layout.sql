-- ============================================================
-- Migration: Add plan and avatar_layout to profiles table
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS avatar_layout TEXT NOT NULL DEFAULT 'classic',
  ADD COLUMN IF NOT EXISTS title_style TEXT DEFAULT 'bold';

-- Ensure backgrounds bucket exists in storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('backgrounds', 'backgrounds', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "backgrounds_upload" ON storage.objects;
CREATE POLICY "backgrounds_upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'backgrounds' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "backgrounds_update" ON storage.objects;
CREATE POLICY "backgrounds_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'backgrounds' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "backgrounds_public_read" ON storage.objects;
CREATE POLICY "backgrounds_public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'backgrounds');
