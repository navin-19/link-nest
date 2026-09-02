-- ============================================================
-- Migration 022: Add source column to subscribers table
-- Distinguishes leads captured via Customer Form, Call Back, and Subscribe Bar
-- ============================================================

ALTER TABLE public.subscribers
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT NULL;

-- Create an index for source lookups if useful
CREATE INDEX IF NOT EXISTS idx_subscribers_source ON public.subscribers(source);

