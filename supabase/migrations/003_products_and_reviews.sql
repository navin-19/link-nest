-- Migration 003: Products and Google Reviews Integration

-- 1. Table: products
CREATE TABLE IF NOT EXISTS public.products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  url         TEXT NOT NULL,
  image_url   TEXT,
  price       TEXT,
  description TEXT,
  position    INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  click_count INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS products_user_id_idx ON public.products (user_id);
CREATE INDEX IF NOT EXISTS products_position_idx ON public.products (user_id, position);

-- 2. Table: product_clicks
CREATE TABLE IF NOT EXISTS public.product_clicks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  clicked_at  TIMESTAMPTZ DEFAULT NOW(),
  referrer    TEXT,
  country     TEXT,
  ip_hash     TEXT
);

CREATE INDEX IF NOT EXISTS product_clicks_product_id_idx ON public.product_clicks (product_id);
CREATE INDEX IF NOT EXISTS product_clicks_clicked_at_idx ON public.product_clicks (clicked_at);

-- 3. Add Google Reviews configuration columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS google_place_id TEXT,
  ADD COLUMN IF NOT EXISTS show_google_reviews BOOLEAN NOT NULL DEFAULT FALSE;

-- 4. Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_clicks ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for products
DROP POLICY IF EXISTS "products_public_select" ON public.products;
CREATE POLICY "products_public_select"
  ON public.products FOR SELECT
  USING (is_active = true OR auth.uid() = user_id);

DROP POLICY IF EXISTS "products_owner_insert" ON public.products;
CREATE POLICY "products_owner_insert"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "products_owner_update" ON public.products;
CREATE POLICY "products_owner_update"
  ON public.products FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "products_owner_delete" ON public.products;
CREATE POLICY "products_owner_delete"
  ON public.products FOR DELETE
  USING (auth.uid() = user_id);

-- 6. RLS Policies for product_clicks
DROP POLICY IF EXISTS "product_clicks_public_insert" ON public.product_clicks;
CREATE POLICY "product_clicks_public_insert"
  ON public.product_clicks FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "product_clicks_owner_select" ON public.product_clicks;
CREATE POLICY "product_clicks_owner_select"
  ON public.product_clicks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = product_clicks.product_id
        AND products.user_id = auth.uid()
    )
  );

-- 7. Storage bucket for product images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "products_storage_public_select" ON storage.objects;
CREATE POLICY "products_storage_public_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

DROP POLICY IF EXISTS "products_storage_owner_insert" ON storage.objects;
CREATE POLICY "products_storage_owner_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "products_storage_owner_update" ON storage.objects;
CREATE POLICY "products_storage_owner_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'products' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "products_storage_owner_delete" ON storage.objects;
CREATE POLICY "products_storage_owner_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'products' AND auth.uid()::text = (storage.foldername(name))[1]);
