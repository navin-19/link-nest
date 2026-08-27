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
    const { productId } = await params;

    if (!productId) {
      return new Response('Missing productId', { status: 400 });
    }

    // Security: Use anon RLS-respecting server client to verify product URL & active status
    const supabase = await createClient();
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('url, is_active')
      .eq('id', productId)
      .maybeSingle();

    if (fetchError || !product || !product.is_active || !product.url) {
      return new Response('Product not found or inactive', { status: 404 });
    }

    // Fail-open analytics tracking: isolated in try/catch so tracking errors NEVER block the redirect
    try {
      await trackClick(request, { targetId: productId, isProduct: true });
    } catch (trackErr) {
      console.error('[track-product] Analytics tracking error (failing open):', trackErr);
    }

    // Redirect user to destination
    const destinationUrl = formatRedirectUrl(product.url);
    return NextResponse.redirect(destinationUrl, 302);
  } catch (err) {
    console.error('Product redirect tracker fatal error:', err);
    return new Response('Internal error', { status: 500 });
  }
}
