-- Migration 012: Add lead details to subscribers table
-- Captures name, country_code, place (city), and full street address for incoming leads.

ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS country_code TEXT;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS place TEXT;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS address TEXT;

-- Ensure delete policy for profile owner
DROP POLICY IF EXISTS "Allow profile owner delete on subscribers" ON public.subscribers;
CREATE POLICY "Allow profile owner delete on subscribers" ON public.subscribers
  FOR DELETE USING (auth.uid() = profile_user_id);
