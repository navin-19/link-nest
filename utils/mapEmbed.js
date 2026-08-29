/**
 * Google Maps Embed URL Helper
 *
 * Extracts, sanitizes, or generates trusted Google Maps embed URLs.
 * Never treats regular share links as iframe src to prevent browser iframe connection errors.
 */

export function getValidMapEmbedUrl(rawUrl, fallbackQuery = '') {
  if (rawUrl && typeof rawUrl === 'string') {
    let url = rawUrl.trim();
    // Extract URL from raw iframe string if user pasted <iframe src="...">
    const iframeMatch = url.match(/src=["']([^"']+)["']/i);
    if (iframeMatch) {
      url = iframeMatch[1];
    }

    // Must match genuine embed patterns
    if (
      url.startsWith('https://www.google.com/maps/embed') ||
      url.startsWith('https://maps.google.com/maps') ||
      url.includes('output=embed')
    ) {
      return url;
    }
  }

  // Construct trusted query embed URL if address or name query is provided
  if (fallbackQuery && typeof fallbackQuery === 'string' && fallbackQuery.trim()) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(fallbackQuery.trim())}&output=embed`;
  }

  return null;
}
