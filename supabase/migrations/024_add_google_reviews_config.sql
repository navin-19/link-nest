-- Migration 024: Add Google Reviews display configuration and cached fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS google_reviews_config JSONB DEFAULT '{"show_rating": true, "limit": 5, "show_logo": true}'::jsonb,
  ADD COLUMN IF NOT EXISTS google_rating NUMERIC DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS google_review_count INT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS google_reviews JSONB DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS google_reviews_last_updated TIMESTAMPTZ DEFAULT NULL;

COMMENT ON COLUMN public.profiles.google_reviews_config IS 'Google Reviews display controls: show_rating, limit, show_logo';
COMMENT ON COLUMN public.profiles.google_reviews IS 'Cached Google Reviews list to prevent client-side rate limits';
