-- ============================================================
-- Migration 023: Add quick_links JSONB column to profiles
-- Stores customer-facing direct action links (WhatsApp, Phone, Email)
-- separated from pure social media profile links (social_links)
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS quick_links JSONB DEFAULT '{}'::jsonb;

-- Backfill existing phone, email, whatsapp from social_links into quick_links if present
UPDATE public.profiles
SET quick_links = jsonb_strip_nulls(
  COALESCE(quick_links, '{}'::jsonb) ||
  jsonb_build_object(
    'whatsapp', social_links->>'whatsapp',
    'phone', social_links->>'phone',
    'email', social_links->>'email'
  )
)
WHERE social_links IS NOT NULL
  AND social_links ?| array['whatsapp', 'phone', 'email']
  AND (quick_links IS NULL OR quick_links = '{}'::jsonb);

-- Remove phone, email from social_links (retain pure social links)
UPDATE public.profiles
SET social_links = social_links - 'phone' - 'email' - 'whatsapp'
WHERE social_links IS NOT NULL
  AND social_links ?| array['whatsapp', 'phone', 'email'];
