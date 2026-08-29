/**
 * Official 6 Preset Themes for LinkNest
 *
 * Each preset defines a complete, professionally curated theme:
 * background, card styling, button styling, fonts, and accents.
 */

export const OFFICIAL_PRESET_THEMES = [
  {
    id: '00000000-0000-0000-0000-000000000007',
    name: 'Ember',
    background: {
      type: 'gradient',
      value: 'radial-gradient(circle at 50% 15%, rgba(234, 88, 12, 0.35) 0%, rgba(180, 83, 9, 0.15) 35%, rgba(9, 9, 11, 0.98) 75%)',
    },
    button_style: 'rounded',
    font: 'Outfit',
  },
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Midnight',
    background: {
      type: 'solid',
      value: '#0f0f1a',
    },
    button_style: 'rounded',
    font: 'Inter',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Aurora',
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    },
    button_style: 'rounded',
    font: 'Inter',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Sunset',
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #1a0533 0%, #3d0068 50%, #c800a1 100%)',
    },
    button_style: 'filled',
    font: 'Outfit',
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    name: 'Ocean',
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #020024 0%, #090979 50%, #00d4ff 100%)',
    },
    button_style: 'outline',
    font: 'Roboto',
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    name: 'Forest',
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #0a2e0a 0%, #1a4a1a 50%, #2d8a2d 100%)',
    },
    button_style: 'shadow',
    font: 'Inter',
  },
];

/**
 * Resolves a theme by ID, matching official presets or falling back to Ember.
 */
export function getPresetThemeById(themeId) {
  if (!themeId) return OFFICIAL_PRESET_THEMES[0];
  return OFFICIAL_PRESET_THEMES.find((t) => t.id === themeId) || OFFICIAL_PRESET_THEMES[0];
}
