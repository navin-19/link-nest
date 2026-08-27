/**
 * Parses a hex color string (#fff, #ffffff, etc.) to [r, g, b] values (0-255).
 */
function parseHexColor(hex) {
  if (!hex || typeof hex !== 'string') return null;
  let clean = hex.trim().replace(/^#/, '');

  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }

  if (clean.length !== 6) return null;

  const num = parseInt(clean, 16);
  if (isNaN(num)) return null;

  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return [r, g, b];
}

/**
 * Calculates standard perceived relative luminance of an RGB color (0 = black, 1 = white).
 * Standard ITU-R BT.601 formula: (0.299*R + 0.587*G + 0.114*B) / 255
 */
export function getLuminance([r, g, b]) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/**
 * Extracts hex colors from a CSS gradient string (e.g. linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%))
 */
function extractColorsFromGradient(gradientStr) {
  if (!gradientStr || typeof gradientStr !== 'string') return [];
  const hexMatches = gradientStr.match(/#[0-9a-fA-F]{3,6}\b/g) || [];
  return hexMatches.map(parseHexColor).filter(Boolean);
}

/**
 * Determines whether a background requires light text ('dark' mode) or dark text ('light' mode).
 * 
 * @param {Object|string} background - Background object { type: 'solid'|'gradient'|'image', value: string } or raw string
 * @returns {'dark' | 'light'} - 'dark' if background is dark (needs light text), 'light' if background is light
 */
export function getContrastMode(background) {
  if (!background) return 'light';

  // 1. If background is an object with type & value
  if (typeof background === 'object') {
    const { type, value } = background;

    if (type === 'solid') {
      const rgb = parseHexColor(value);
      if (rgb) {
        return getLuminance(rgb) < 0.55 ? 'dark' : 'light';
      }
      return 'light';
    }

    if (type === 'gradient') {
      const colors = extractColorsFromGradient(value);
      if (colors.length > 0) {
        const avgLuminance =
          colors.reduce((sum, rgb) => sum + getLuminance(rgb), 0) / colors.length;
        return avgLuminance < 0.55 ? 'dark' : 'light';
      }
      return 'light';
    }

    if (type === 'image') {
      // Images default to dark mode (light text) as a safe, high-contrast default
      return 'dark';
    }

    return 'light';
  }

  // 2. If background is a string
  if (typeof background === 'string') {
    const trimmed = background.trim();

    if (trimmed.startsWith('#')) {
      const rgb = parseHexColor(trimmed);
      if (rgb) {
        return getLuminance(rgb) < 0.55 ? 'dark' : 'light';
      }
      return 'light';
    }

    if (trimmed.startsWith('linear-gradient') || trimmed.startsWith('radial-gradient')) {
      const colors = extractColorsFromGradient(trimmed);
      if (colors.length > 0) {
        const avgLuminance =
          colors.reduce((sum, rgb) => sum + getLuminance(rgb), 0) / colors.length;
        return avgLuminance < 0.55 ? 'dark' : 'light';
      }
      return 'light';
    }

    if (trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('data:image')) {
      return 'dark';
    }
  }

  return 'light';
}

export default getContrastMode;
