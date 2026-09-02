-- Migration 020: Add customer_form_enabled boolean to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS customer_form_enabled BOOLEAN DEFAULT TRUE;
