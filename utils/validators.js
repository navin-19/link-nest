import { isReservedUsername } from './reservedUsernames';

/**
 * Validates a username string.
 * Rules: 3–20 chars, lowercase letters/numbers/hyphens/underscores only, not reserved.
 * @param {string} username
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateUsername(username) {
  if (!username) return { valid: false, error: 'Username is required.' };
  if (username.length < 3) return { valid: false, error: 'Username must be at least 3 characters.' };
  if (username.length > 20) return { valid: false, error: 'Username must be 20 characters or fewer.' };
  if (!/^[a-z0-9_-]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain lowercase letters, numbers, hyphens, and underscores.' };
  }
  if (username.startsWith('-') || username.endsWith('-')) {
    return { valid: false, error: 'Username cannot start or end with a hyphen.' };
  }
  if (username.startsWith('_') || username.endsWith('_')) {
    return { valid: false, error: 'Username cannot start or end with an underscore.' };
  }
  if (isReservedUsername(username)) {
    return { valid: false, error: 'This username is not available.' };
  }
  return { valid: true };
}

/**
 * Validates a URL string.
 * @param {string} url
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateUrl(url) {
  if (!url) return { valid: false, error: 'URL is required.' };
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'URL must start with http:// or https://' };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: 'Please enter a valid URL (e.g. https://example.com).' };
  }
}

/**
 * Validates a link title.
 * @param {string} title
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateLinkTitle(title) {
  if (!title || title.trim().length === 0) return { valid: false, error: 'Title is required.' };
  if (title.length > 100) return { valid: false, error: 'Title must be 100 characters or fewer.' };
  return { valid: true };
}

/**
 * Sanitizes a username to lowercase and trims whitespace.
 * @param {string} username
 * @returns {string}
 */
export function normalizeUsername(username) {
  return username?.toLowerCase().trim() ?? '';
}
