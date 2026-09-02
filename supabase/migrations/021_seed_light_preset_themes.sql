-- ============================================================
-- Migration 021: Seed 3 Light Preset Themes (Cloud, Blossom, Sand)
-- ============================================================

INSERT INTO public.themes (id, user_id, name, background, button_style, font, text_color) VALUES
  ('00000000-0000-0000-0000-000000000008', NULL, 'Cloud',
   '{"type":"gradient","value":"linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)"}'::jsonb, 'rounded', 'Inter', '#0f172a'),
  ('00000000-0000-0000-0000-000000000009', NULL, 'Blossom',
   '{"type":"gradient","value":"linear-gradient(135deg, #fff1f5 0%, #ffe4ec 50%, #fdf2f8 100%)"}'::jsonb, 'rounded', 'Poppins', '#0f172a'),
  ('00000000-0000-0000-0000-000000000010', NULL, 'Sand',
   '{"type":"gradient","value":"linear-gradient(135deg, #fdf6ec 0%, #f5e9d3 100%)"}'::jsonb, 'rounded', 'DM Sans', '#0f172a')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  background = EXCLUDED.background,
  button_style = EXCLUDED.button_style,
  font = EXCLUDED.font,
  text_color = EXCLUDED.text_color;
