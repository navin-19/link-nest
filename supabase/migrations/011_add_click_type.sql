-- Migration 011: Add click_type and profile_user_id to link_clicks table
-- Enables tracking distinct click types ('link', 'whatsapp', 'call') and profile-level contact clicks.

ALTER TABLE public.link_clicks ADD COLUMN IF NOT EXISTS click_type TEXT NOT NULL DEFAULT 'link';
ALTER TABLE public.link_clicks ALTER COLUMN link_id DROP NOT NULL;
ALTER TABLE public.link_clicks ADD COLUMN IF NOT EXISTS profile_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS link_clicks_click_type_idx ON public.link_clicks (click_type);
CREATE INDEX IF NOT EXISTS link_clicks_profile_user_id_idx ON public.link_clicks (profile_user_id);

-- Update SELECT policy for profile owners to see both link-level and profile-level clicks
DROP POLICY IF EXISTS "link_clicks_owner_select" ON public.link_clicks;
CREATE POLICY "link_clicks_owner_select"
  ON public.link_clicks FOR SELECT
  USING (
    (link_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.links
      WHERE links.id = link_clicks.link_id
        AND links.user_id = auth.uid()
    ))
    OR
    (profile_user_id IS NOT NULL AND profile_user_id = auth.uid())
  );
