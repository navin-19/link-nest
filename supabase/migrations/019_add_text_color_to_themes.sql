-- Migration 019: Add text_color to themes table
ALTER TABLE public.themes ADD COLUMN IF NOT EXISTS text_color TEXT DEFAULT NULL;
