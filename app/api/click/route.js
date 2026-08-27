import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { trackClick } from '@/lib/trackClick';

export async function POST(request) {
  try {
    const { linkId, productId, referrer } = await request.json();

    if (!linkId && !productId) {
      return NextResponse.json({ error: 'Missing linkId or productId' }, { status: 400 });
    }

    const isProduct = Boolean(productId);
    const targetId = isProduct ? productId : linkId;

    // Security: Use anon RLS-respecting server client for checking active status
    const supabase = await createClient();
    const table = isProduct ? 'products' : 'links';

    const { data: item, error } = await supabase
      .from(table)
      .select('id, is_active')
      .eq('id', targetId)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !item) {
      return NextResponse.json({ error: 'Item not found or inactive' }, { status: 404 });
    }

    // Consolidated rate limiting, click logging, and atomic RPC increment (fail-open)
    try {
      const result = await trackClick(request, {
        targetId,
        isProduct,
        referrer,
      });

      if (result.limited) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
      }
    } catch (trackErr) {
      console.error('[api/click] Analytics tracking error (failing open):', trackErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Click API error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
