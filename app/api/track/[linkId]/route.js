import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseServer';
import crypto from 'crypto';

export async function GET(request, { params }) {
  try {
    const { linkId } = await params;

    if (!linkId) {
      return new Response('Missing linkId', { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Fetch link details
    const { data: link, error: fetchError } = await supabase
      .from('links')
      .select('url, is_active')
      .eq('id', linkId)
      .single();

    if (fetchError || !link || !link.is_active) {
      return new Response('Link not found or inactive', { status: 404 });
    }

    // 2. Extract details
    const referrerHeader = request.headers.get('referer') || '';
    
    // Hash IP address for privacy
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

    // Geo-location from Vercel header or null
    const country = request.headers.get('x-vercel-ip-country') || null;

    // 3. Log click asynchronously
    try {
      await supabase.from('link_clicks').insert({
        link_id: linkId,
        referrer: referrerHeader || null,
        country: country,
        ip_hash: ipHash,
      });
    } catch (insertErr) {
      console.error('Failed to insert link click:', insertErr);
    }

    // 4. Increment click count
    const { error: rpcError } = await supabase.rpc('increment_click_count', {
      link_id: linkId,
    });

    if (rpcError) {
      // Fallback increment
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

    // 5. Redirect user to destination
    return NextResponse.redirect(link.url, 302);
  } catch (err) {
    console.error('Redirect tracker error:', err);
    return new Response('Internal error', { status: 500 });
  }
}
