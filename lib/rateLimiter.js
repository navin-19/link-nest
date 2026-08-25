/**
 * Simple in-memory rate limiter for the /api/click endpoint.
 * Limits each IP+linkId pair to MAX_HITS within WINDOW_MS.
 *
 * For production, replace with a Redis-backed solution (e.g. Upstash Redis).
 */

const MAX_HITS = 3;           // max clicks per window
const WINDOW_MS = 60 * 1000; // 1-minute window

// Map key: `${ip}:${linkId}` → { count, resetAt }
const store = new Map();

// Periodically clean up expired entries to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of store.entries()) {
    if (val.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000); // clean every 5 minutes

/**
 * Check if a request is rate-limited.
 * @param {string} ip  - Client IP address
 * @param {string} linkId - Link UUID being clicked
 * @returns {{ limited: boolean, remaining: number, resetAt: number }}
 */
export function checkRateLimit(ip, linkId) {
  const key = `${ip}:${linkId}`;
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // Fresh window
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { limited: false, remaining: MAX_HITS - 1, resetAt: now + WINDOW_MS };
  }

  if (entry.count >= MAX_HITS) {
    return { limited: true, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  store.set(key, entry);
  return { limited: false, remaining: MAX_HITS - entry.count, resetAt: entry.resetAt };
}
