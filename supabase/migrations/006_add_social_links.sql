-- ============================================================
-- Migration 006: Add social_links JSONB column to profiles
-- Stores user's direct social media profile links/handles
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;
