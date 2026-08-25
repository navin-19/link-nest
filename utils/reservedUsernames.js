/**
 * Reserved usernames that cannot be registered —
 * they collide with Next.js app routes or common admin paths.
 */
export const RESERVED_USERNAMES = new Set([
  'dashboard',
  'api',
  'login',
  'signup',
  'register',
  'reset-password',
  'forgot-password',
  'settings',
  'admin',
  'administrator',
  'root',
  'superuser',
  'support',
  'help',
  'faq',
  'about',
  'contact',
  'pricing',
  'blog',
  'docs',
  'documentation',
  'terms',
  'privacy',
  'legal',
  'status',
  'health',
  'me',
  'my',
  'profile',
  'account',
  'user',
  'users',
  'auth',
  'oauth',
  'callback',
  'linknest',
  'www',
  'mail',
  'email',
  'app',
  'web',
  'mobile',
  'static',
  'assets',
  'images',
  'files',
  'upload',
  'uploads',
  'media',
  'cdn',
  'null',
  'undefined',
  'anonymous',
  'guest',
  'test',
  'demo',
  'example',
  'sample',
]);

/**
 * Checks if a username is reserved.
 * @param {string} username
 * @returns {boolean}
 */
export function isReservedUsername(username) {
  return RESERVED_USERNAMES.has(username.toLowerCase());
}
