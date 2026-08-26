import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseServer';
import { checkRateLimit } from '@/lib/rateLimiter';

export async function POST(request) {
  try {
    const { linkId, productId, referrer } = await request.json();

    if (!linkId && !productId) {
      return NextResponse.json({ error: 'Missing linkId or productId' }, { status: 400 });
    }

    const targetId = linkId || productId;

    // Extract client IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // Rate-limit check
    const { limited } = checkRateLimit(ip, targetId);
    if (limited) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const supabase = createAdminClient();

    if (productId) {
      // 1. Insert product click
      await supabase.from('product_clicks').insert({
        product_id: productId,
        referrer: referrer || null,
        country: request.headers.get('x-vercel-ip-country') || null,
      }).catch(() => {});

      // 2. Increment product click_count
      const { data: currentProduct } = await supabase
        .from('products')
        .select('click_count')
        .eq('id', productId)
        .single();

      if (currentProduct) {
        await supabase
          .from('products')
          .update({ click_count: (currentProduct.click_count || 0) + 1 })
          .eq('id', productId);
      }
    } else {
      // 1. Insert row into link_clicks
      const { error: insertError } = await supabase.from('link_clicks').insert({
        link_id: linkId,
        referrer: referrer || null,
        country: request.headers.get('x-vercel-ip-country') || null,
      });

      if (insertError) {
        console.error('Click insert error:', insertError);
      }

      // 2. Increment click_count atomically via RPC or direct update
      const { error: rpcError } = await supabase.rpc('increment_click_count', {
        link_id: linkId,
      });

      if (rpcError) {
        // Fallback: direct update
        const { data: currentLink } = await supabase
          .from('links')
          .select('click_count')
          .eq('id', linkId)
          .single();

        if (currentLink) {
          await supabase
            .from('links')
            .update({ click_count: (currentLink.click_count || 0) + 1 })
            .eq('id', linkId);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Click API error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
