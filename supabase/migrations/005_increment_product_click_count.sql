-- ============================================================
-- Migration 005: Increment product click count function
-- Atomically increments click_count on products table
-- ============================================================

CREATE OR REPLACE FUNCTION public.increment_product_click_count(product_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.products
  SET click_count = click_count + 1
  WHERE id = product_id;
END;
$$;
