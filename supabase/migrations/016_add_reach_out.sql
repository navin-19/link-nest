-- Migration 016: Add reach_out column to profiles table
-- Stores structured business contact/location info: address, mapEmbedUrl, phone, email, hours

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS reach_out JSONB DEFAULT NULL;

COMMENT ON COLUMN public.profiles.reach_out IS 'Structured contact & location data: address, mapEmbedUrl, phone, email, hours';
