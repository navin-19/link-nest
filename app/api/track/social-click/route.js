import { NextResponse } from 'next/server';
import { trackClick } from '@/lib/trackClick';

/**
 * POST /api/track/social-click
 * Lightweight endpoint to track profile-level social/contact clicks (e.g. WhatsApp, Call)
 * without blocking navigation. Fail-open by design.
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { profileUserId, click_type, clickType, referrer } = body;
    const effectiveClickType = click_type || clickType || 'link';

    if (!profileUserId) {
      return NextResponse.json({ error: 'Missing profileUserId' }, { status: 400 });
    }

    try {
      await trackClick(request, {
        profileUserId,
        clickType: effectiveClickType,
        referrer,
      });
    } catch (trackErr) {
      console.error('[social-click] Analytics tracking error (failing open):', trackErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Social click API fatal error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
