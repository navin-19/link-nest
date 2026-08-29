-- ============================================================
-- Migration 017: Seed 6 Official Preset Themes
-- Ensures the exact 6 official preset themes are present in public.themes
-- ============================================================

INSERT INTO public.themes (id, user_id, name, background, button_style, font) VALUES
  ('00000000-0000-0000-0000-000000000007', NULL, 'Ember',
   '{"type":"gradient","value":"radial-gradient(circle at 50% 15%, rgba(234,88,12,0.35) 0%, rgba(180,83,9,0.15) 35%, rgba(9,9,11,0.98) 75%)"}'::jsonb, 'rounded', 'Outfit'),
  ('00000000-0000-0000-0000-000000000001', NULL, 'Midnight',
   '{"type":"solid","value":"#0f0f1a"}'::jsonb, 'rounded', 'Inter'),
  ('00000000-0000-0000-0000-000000000002', NULL, 'Aurora',
   '{"type":"gradient","value":"linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)"}'::jsonb, 'rounded', 'Inter'),
  ('00000000-0000-0000-0000-000000000003', NULL, 'Sunset',
   '{"type":"gradient","value":"linear-gradient(135deg,#1a0533 0%,#3d0068 50%,#c800a1 100%)"}'::jsonb, 'filled', 'Outfit'),
  ('00000000-0000-0000-0000-000000000004', NULL, 'Ocean',
   '{"type":"gradient","value":"linear-gradient(135deg,#020024 0%,#090979 50%,#00d4ff 100%)"}'::jsonb, 'outline', 'Roboto'),
  ('00000000-0000-0000-0000-000000000005', NULL, 'Forest',
   '{"type":"gradient","value":"linear-gradient(135deg,#0a2e0a 0%,#1a4a1a 50%,#2d8a2d 100%)"}'::jsonb, 'shadow', 'Inter')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  background = EXCLUDED.background,
  button_style = EXCLUDED.button_style,
  font = EXCLUDED.font;
