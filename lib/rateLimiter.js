import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabaseServer';

const MAX_HITS = 5;            // Max clicks allowed per window
const WINDOW_SECONDS = 60;     // 1-minute rate limit window

/**
 * Durable, database-backed rate limiter for click endpoints across serverless cold starts.
 * Queries recent click logs from link_clicks or product_clicks for the hashed IP.
 *
 * @param {string} ip - Client IP address
 * @param {string} targetId - UUID of the target link, product, or profile
 * @param {boolean} [isProduct=false] - Whether the target is a product or link
 * @param {boolean} [isProfile=false] - Whether the target is a profile user ID
 * @returns {Promise<{ limited: boolean, remaining: number, resetAt: number }>}
 */
export async function checkRateLimit(ip, targetId, isProduct = false, isProfile = false) {
  if (!ip || !targetId) {
    return { limited: false, remaining: MAX_HITS, resetAt: Date.now() + WINDOW_SECONDS * 1000 };
  }

  try {
    // Service role required to read aggregated click logs across anonymous IPs (bypasses RLS owner-only SELECT)
    const supabase = createAdminClient();
    
    // Compute SHA-256 hash of IP address for privacy-compliant matching
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');
    const windowStart = new Date(Date.now() - WINDOW_SECONDS * 1000).toISOString();

    const table = isProduct ? 'product_clicks' : 'link_clicks';
    const idColumn = isProduct ? 'product_id' : isProfile ? 'profile_user_id' : 'link_id';

    const { count, error } = await supabase
      .from(table)
      .select('id', { count: 'exact', head: true })
      .eq(idColumn, targetId)
      .eq('ip_hash', ipHash)
      .gte('clicked_at', windowStart);

    if (error) {
      console.warn('[rateLimiter] DB rate limit check failed, allowing request:', error.message);
      return { limited: false, remaining: 1, resetAt: Date.now() + WINDOW_SECONDS * 1000 };
    }

    const clickCount = count || 0;
    if (clickCount >= MAX_HITS) {
      return { limited: true, remaining: 0, resetAt: Date.now() + WINDOW_SECONDS * 1000 };
    }

    return {
      limited: false,
      remaining: MAX_HITS - clickCount - 1,
      resetAt: Date.now() + WINDOW_SECONDS * 1000,
    };
  } catch (err) {
    console.error('[rateLimiter] Error performing rate limit check:', err);
    return { limited: false, remaining: 1, resetAt: Date.now() + WINDOW_SECONDS * 1000 };
  }
}
