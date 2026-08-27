-- ============================================================
-- Migration 007: Add dashboard_card_background JSONB column to profiles
-- Stores user's decorative dashboard backdrop styling preference
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS dashboard_card_background JSONB DEFAULT NULL;
