-- Migration 015: Add Super Admin and Suspension flags to profiles table, with RLS policies

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_suspended   BOOLEAN NOT NULL DEFAULT FALSE;

-- Helper function with SECURITY DEFINER to break RLS infinite recursion
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_super_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Allow admins to read every profile (not just their own)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_super_admin());

-- Allow admins to update every profile (not just their own)
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_super_admin());

-- Allow admins to read every subscriber/lead, not just their own
DROP POLICY IF EXISTS "Admins can view all subscribers" ON public.subscribers;
CREATE POLICY "Admins can view all subscribers" ON public.subscribers
  FOR SELECT USING (public.is_super_admin());
