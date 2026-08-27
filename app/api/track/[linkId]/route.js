import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { trackClick } from '@/lib/trackClick';

function formatRedirectUrl(url) {
  if (!url) return '/';
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url)) {
    return url;
  }
  return `https://${url}`;
}

export async function GET(request, { params }) {
  try {
    const { linkId } = await params;

    if (!linkId) {
      return new Response('Missing linkId', { status: 400 });
    }

    // Security: Use anon RLS-respecting server client to verify link URL & active status
    const supabase = await createClient();
    const { data: link, error: fetchError } = await supabase
      .from('links')
      .select('url, is_active')
      .eq('id', linkId)
      .maybeSingle();

    if (fetchError || !link || !link.is_active || !link.url) {
      return new Response('Link not found or inactive', { status: 404 });
    }

    // Fail-open analytics tracking: isolated in try/catch so tracking errors NEVER block the redirect
    try {
      const { searchParams } = new URL(request.url);
      const clickType = searchParams.get('click_type') || searchParams.get('type') || 'link';
      await trackClick(request, { targetId: linkId, isProduct: false, clickType });
    } catch (trackErr) {
      console.error('[track-link] Analytics tracking error (failing open):', trackErr);
    }

    // Redirect user to target destination URL
    const destinationUrl = formatRedirectUrl(link.url);
    return NextResponse.redirect(destinationUrl, 302);
  } catch (err) {
    console.error('Redirect tracker fatal error:', err);
    return new Response('Internal error', { status: 500 });
  }
}
