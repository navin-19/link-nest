-- ============================================================
-- LinkNest — Supabase Schema & RLS Policies
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. TABLE: profiles
-- Created first without FK to themes to avoid circular dependency
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username     TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio          TEXT,
  avatar_url   TEXT,
  theme_id     UUID,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles (username);

-- ============================================================
-- 2. TABLE: themes
-- References profiles(id)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.themes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name         TEXT,
  background   JSONB NOT NULL DEFAULT '{"type":"solid","value":"#0f0f1a"}'::jsonb,
  button_style TEXT NOT NULL DEFAULT 'rounded',
  font         TEXT NOT NULL DEFAULT 'Inter',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Add Foreign Key from profiles.theme_id -> themes.id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_theme_id_fkey'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_theme_id_fkey
      FOREIGN KEY (theme_id) REFERENCES public.themes(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================
-- 3. TABLE: links
-- ============================================================
CREATE TABLE IF NOT EXISTS public.links (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  url         TEXT NOT NULL,
  icon        TEXT,
  position    INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  click_count INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS links_user_id_idx ON public.links (user_id);
CREATE INDEX IF NOT EXISTS links_position_idx ON public.links (user_id, position);

-- ============================================================
-- 4. TABLE: link_clicks
-- ============================================================
CREATE TABLE IF NOT EXISTS public.link_clicks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id    UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  referrer   TEXT,
  country    TEXT,
  ip_hash    TEXT
);

CREATE INDEX IF NOT EXISTS link_clicks_link_id_idx  ON public.link_clicks (link_id);
CREATE INDEX IF NOT EXISTS link_clicks_clicked_at_idx ON public.link_clicks (clicked_at);

-- ============================================================
-- 5. SEED: Global preset themes (user_id = NULL means public preset)
-- ============================================================
INSERT INTO public.themes (id, user_id, name, background, button_style, font) VALUES
  ('00000000-0000-0000-0000-000000000001', NULL, 'Midnight',
   '{"type":"solid","value":"#0f0f1a"}'::jsonb, 'rounded', 'Inter'),
  ('00000000-0000-0000-0000-000000000002', NULL, 'Aurora',
   '{"type":"gradient","value":"linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)"}'::jsonb, 'rounded', 'Inter'),
  ('00000000-0000-0000-0000-000000000003', NULL, 'Sunset',
   '{"type":"gradient","value":"linear-gradient(135deg,#1a0533 0%,#3d0068 50%,#c800a1 100%)"}'::jsonb, 'filled', 'Outfit'),
  ('00000000-0000-0000-0000-000000000004', NULL, 'Ocean',
   '{"type":"gradient","value":"linear-gradient(135deg,#020024 0%,#090979 50%,#00d4ff 100%)"}'::jsonb, 'outline', 'Roboto'),
  ('00000000-0000-0000-0000-000000000005', NULL, 'Forest',
   '{"type":"gradient","value":"linear-gradient(135deg,#0a2e0a 0%,#1a4a1a 50%,#2d8a2d 100%)"}'::jsonb, 'shadow', 'Inter'),
  ('00000000-0000-0000-0000-000000000006', NULL, 'Rose Gold',
   '{"type":"gradient","value":"linear-gradient(135deg,#1a0a0a 0%,#3d1515 50%,#c87941 100%)"}'::jsonb, 'rounded', 'Outfit')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

-- ── profiles policies ──────────────────────────────────────
DROP POLICY IF EXISTS "profiles_public_select" ON public.profiles;
CREATE POLICY "profiles_public_select"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "profiles_owner_insert" ON public.profiles;
CREATE POLICY "profiles_owner_insert"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_owner_update" ON public.profiles;
CREATE POLICY "profiles_owner_update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_owner_delete" ON public.profiles;
CREATE POLICY "profiles_owner_delete"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- ── links policies ─────────────────────────────────────────
DROP POLICY IF EXISTS "links_public_select" ON public.links;
CREATE POLICY "links_public_select"
  ON public.links FOR SELECT
  USING (is_active = true OR auth.uid() = user_id);

DROP POLICY IF EXISTS "links_owner_insert" ON public.links;
CREATE POLICY "links_owner_insert"
  ON public.links FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "links_owner_update" ON public.links;
CREATE POLICY "links_owner_update"
  ON public.links FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "links_owner_delete" ON public.links;
CREATE POLICY "links_owner_delete"
  ON public.links FOR DELETE
  USING (auth.uid() = user_id);

-- ── themes policies ────────────────────────────────────────
DROP POLICY IF EXISTS "themes_public_select" ON public.themes;
CREATE POLICY "themes_public_select"
  ON public.themes FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

DROP POLICY IF EXISTS "themes_owner_insert" ON public.themes;
CREATE POLICY "themes_owner_insert"
  ON public.themes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "themes_owner_update" ON public.themes;
CREATE POLICY "themes_owner_update"
  ON public.themes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "themes_owner_delete" ON public.themes;
CREATE POLICY "themes_owner_delete"
  ON public.themes FOR DELETE
  USING (auth.uid() = user_id);

-- ── link_clicks policies ───────────────────────────────────
DROP POLICY IF EXISTS "link_clicks_public_insert" ON public.link_clicks;
CREATE POLICY "link_clicks_public_insert"
  ON public.link_clicks FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "link_clicks_owner_select" ON public.link_clicks;
CREATE POLICY "link_clicks_owner_select"
  ON public.link_clicks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.links
      WHERE links.id = link_clicks.link_id
        AND links.user_id = auth.uid()
    )
  );

-- ============================================================
-- 7. STORAGE: Avatars Bucket Setup
-- ============================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "avatar_upload" ON storage.objects;
CREATE POLICY "avatar_upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "avatar_update" ON storage.objects;
CREATE POLICY "avatar_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "avatar_public_read" ON storage.objects;
CREATE POLICY "avatar_public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- ============================================================
-- 8. FUNCTION & TRIGGER: Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || LEFT(NEW.id::text, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- 9. FUNCTION: Increment click_count atomically
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_click_count(link_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.links
  SET click_count = click_count + 1
  WHERE id = link_id;
END;
$$;
