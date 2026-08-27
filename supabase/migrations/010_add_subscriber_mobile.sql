-- Migration 010: Add mobile_number column to subscribers table
-- Allows visitors to optionally provide a phone/mobile contact number for outreach & monetization.

ALTER TABLE public.subscribers
  ADD COLUMN IF NOT EXISTS mobile_number TEXT;
