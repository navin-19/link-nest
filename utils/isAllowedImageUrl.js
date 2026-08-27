/**
 * Checks whether an image URL matches the configured Next.js image remote patterns
 * or is a valid local/data URL.
 * 
 * Configured in next.config.js:
 *   - **.supabase.co
 *   - **.googleusercontent.com
 *   - local relative paths (/...)
 *   - data:image/...
 */
export function isValidProductImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();

  // Local relative paths and data URIs
  if (trimmed.startsWith('/') || trimmed.startsWith('data:image/')) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();

    return (
      host.endsWith('.supabase.co') ||
      host === 'supabase.co' ||
      host.endsWith('.googleusercontent.com') ||
      host === 'googleusercontent.com' ||
      host === 'localhost' ||
      host === '127.0.0.1'
    );
  } catch {
    return false;
  }
}

export default isValidProductImageUrl;
