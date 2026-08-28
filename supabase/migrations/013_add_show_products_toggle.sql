-- Add show_products toggle to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS show_products BOOLEAN NOT NULL DEFAULT TRUE;
