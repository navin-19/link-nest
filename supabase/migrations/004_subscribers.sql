-- ============================================================
-- 5. TABLE: subscribers
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscribers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_user_id, email)
);

-- Enable RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can subscribe (anonymous inserts allowed)
CREATE POLICY "Allow public insert on subscribers" ON public.subscribers
  FOR INSERT WITH CHECK (true);

-- Policy: Only the profile owner can read their subscribers
CREATE POLICY "Allow profile owner select on subscribers" ON public.subscribers
  FOR SELECT USING (auth.uid() = profile_user_id);
