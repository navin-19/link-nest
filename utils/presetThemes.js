/**
 * Official 9 Preset Themes for LinkNest (6 Dark + 3 Light)
 *
 * Each preset defines a complete, professionally curated theme:
 * background, card styling, button styling, fonts, and accents.
 */

export const OFFICIAL_PRESET_THEMES = [
  // ── Dark Presets ─────────────────────────────────────────────────────────────
  {
    id: '00000000-0000-0000-0000-000000000007',
    slug: 'ember',
    name: 'Ember',
    background: {
      type: 'gradient',
      value: 'radial-gradient(circle at 50% 15%, rgba(234, 88, 12, 0.35) 0%, rgba(180, 83, 9, 0.15) 35%, rgba(9, 9, 11, 0.98) 75%)',
    },
    button_style: 'rounded',
    font: 'Outfit',
    text_color: '#ffffff',
  },
  {
    id: '00000000-0000-0000-0000-000000000001',
    slug: 'midnight',
    name: 'Midnight',
    background: {
      type: 'solid',
      value: '#0f0f1a',
    },
    button_style: 'rounded',
    font: 'Inter',
    text_color: '#ffffff',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    slug: 'aurora',
    name: 'Aurora',
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    },
    button_style: 'rounded',
    font: 'Inter',
    text_color: '#ffffff',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    slug: 'sunset',
    name: 'Sunset',
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #1a0533 0%, #3d0068 50%, #c800a1 100%)',
    },
    button_style: 'filled',
    font: 'Outfit',
    text_color: '#ffffff',
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    slug: 'ocean',
    name: 'Ocean',
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #020024 0%, #090979 50%, #00d4ff 100%)',
    },
    button_style: 'outline',
    font: 'Roboto',
    text_color: '#ffffff',
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    slug: 'forest',
    name: 'Forest',
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #0a2e0a 0%, #1a4a1a 50%, #2d8a2d 100%)',
    },
    button_style: 'shadow',
    font: 'Inter',
    text_color: '#ffffff',
  },

  // ── Light Presets ────────────────────────────────────────────────────────────
  {
    id: '00000000-0000-0000-0000-000000000008',
    slug: 'cloud',
    name: 'Cloud',
    description: 'Soft white with subtle gray gradient',
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
    },
    button_style: 'rounded',
    font: 'Inter',
    text_color: '#0f172a',
  },
  {
    id: '00000000-0000-0000-0000-000000000009',
    slug: 'blossom',
    name: 'Blossom',
    description: 'Pastel pink and cream glow',
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #fff1f5 0%, #ffe4ec 50%, #fdf2f8 100%)',
    },
    button_style: 'rounded',
    font: 'Poppins',
    text_color: '#0f172a',
  },
  {
    id: '00000000-0000-0000-0000-000000000010',
    slug: 'sand',
    name: 'Sand',
    description: 'Warm beige and cream tones',
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #fdf6ec 0%, #f5e9d3 100%)',
    },
    button_style: 'rounded',
    font: 'DM Sans',
    text_color: '#0f172a',
  },
];

/**
 * Resolves a theme by ID or slug, matching official presets or falling back to Ember.
 */
export function getPresetThemeById(themeId) {
  if (!themeId) return OFFICIAL_PRESET_THEMES[0];
  return (
    OFFICIAL_PRESET_THEMES.find(
      (t) =>
        t.id === themeId ||
        t.slug === themeId ||
        t.name.toLowerCase() === String(themeId).toLowerCase()
    ) || OFFICIAL_PRESET_THEMES[0]
  );
}
