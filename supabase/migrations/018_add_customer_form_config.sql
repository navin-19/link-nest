-- Migration 018: Add customer_form_config to profiles and custom_data to subscribers

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS customer_form_config JSONB DEFAULT NULL;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS custom_data JSONB DEFAULT '{}'::jsonb;
