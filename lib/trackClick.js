import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabaseServer';
import { checkRateLimit } from '@/lib/rateLimiter';

/**
 * Shared, consolidated click tracking logic for link and product clicks.
 * Handles durable rate limiting, anonymous click logging, and atomic click_count RPC increments.
 *
 * @param {Request} request - Next.js / Web Request object
 * @param {Object} options
 * @param {string} [options.targetId] - UUID of the link or product
 * @param {string} [options.profileUserId] - UUID of the profile owner for social/contact clicks
 * @param {boolean} [options.isProduct=false] - Whether the target is a product or link
 * @param {string} [options.clickType='link'] - Click event type ('link' | 'whatsapp' | 'call')
 * @param {string} [options.referrer] - Optional custom referrer string
 * @returns {Promise<{ limited: boolean, success?: boolean, error?: string }>}
 */
export async function trackClick(request, { targetId, profileUserId, isProduct = false, clickType = 'link', referrer: customReferrer } = {}) {
  const effectiveTargetId = targetId || profileUserId;
  if (!effectiveTargetId) {
    return { limited: false, success: false, error: 'Target ID or Profile User ID required' };
  }

  // Extract client IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

  // 1. Durable rate-limit check
  const isProfile = Boolean(!targetId && profileUserId);
  const { limited } = await checkRateLimit(ip, effectiveTargetId, isProduct, isProfile);
  if (limited) {
    return { limited: true, success: false, error: 'Rate limit exceeded' };
  }

  // Hash IP for privacy compliance
  const ipHash = crypto.createHash('sha256').update(ip).digest('hex');
  const referrer = customReferrer || request.headers.get('referer') || null;
  const country = request.headers.get('x-vercel-ip-country') || null;

  // 2. Service role key used strictly for trusted analytics background insert & atomic click increment
  const supabase = createAdminClient();

  if (isProduct) {
    // Log product click
    await supabase.from('product_clicks').insert({
      product_id: targetId,
      referrer,
      country,
      ip_hash: ipHash,
    }).catch((err) => console.error('[trackClick] Product click insert error:', err));

    // Atomic product click increment RPC
    const { error: rpcErr } = await supabase.rpc('increment_product_click_count', {
      product_id: targetId,
    });
    if (rpcErr) {
      console.error('[trackClick] RPC increment_product_click_count error:', rpcErr);
    }
  } else {
    // Log link click or profile social/contact click
    const insertPayload = {
      link_id: targetId || null,
      profile_user_id: profileUserId || null,
      click_type: clickType || 'link',
      referrer,
      country,
      ip_hash: ipHash,
    };

    await supabase.from('link_clicks').insert(insertPayload).catch((err) => console.error('[trackClick] Link click insert error:', err));

    // Atomic link click increment RPC (only if tied to a specific links row)
    if (targetId) {
      const { error: rpcErr } = await supabase.rpc('increment_click_count', {
        link_id: targetId,
      });
      if (rpcErr) {
        console.error('[trackClick] RPC increment_click_count error:', rpcErr);
      }
    }
  }

  return { limited: false, success: true };
}
