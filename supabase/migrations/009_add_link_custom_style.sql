-- Migration 009: Add custom_style JSONB column to links table
-- Allows optional per-link button style overrides (e.g. {"buttonStyle": "neobrutalism"})
-- that take precedence over the global theme.button_style without affecting other links.

ALTER TABLE public.links
  ADD COLUMN IF NOT EXISTS custom_style JSONB DEFAULT NULL;
