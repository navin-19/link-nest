import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseServer';
import crypto from 'crypto';

export async function GET(request, { params }) {
  try {
    const { productId } = await params;

    if (!productId) {
      return new Response('Missing productId', { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Fetch product details
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('url, is_active')
      .eq('id', productId)
      .single();

    if (fetchError || !product || !product.is_active) {
      return new Response('Product not found or inactive', { status: 404 });
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
      await supabase.from('product_clicks').insert({
        product_id: productId,
        referrer: referrerHeader || null,
        country: country,
        ip_hash: ipHash,
      });
    } catch (insertErr) {
      console.error('Failed to insert product click:', insertErr);
    }

    // 4. Increment click count
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

    // 5. Redirect user to destination
    return NextResponse.redirect(product.url, 302);
  } catch (err) {
    console.error('Product redirect tracker error:', err);
    return new Response('Internal error', { status: 500 });
  }
}
