-- Migration 008: Allow public SELECT on themes table
-- Custom themes created by profile owners need to be readable by unauthenticated visitors
-- so that public profile pages (/[username]) render the user's custom theme design.

DROP POLICY IF EXISTS "themes_public_select" ON public.themes;

CREATE POLICY "themes_public_select"
  ON public.themes FOR SELECT
  USING (true);
