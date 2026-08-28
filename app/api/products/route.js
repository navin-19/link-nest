import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabaseServer';
import { validateUrl } from '@/utils/validators';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.id)
    .order('position', { ascending: true });

  if (error) {
    if (error.code === 'PGRST204' || error.code === 'PGRST200' || error.message?.includes('schema cache')) {
      return NextResponse.json({ products: [] });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: products || [] });
}

export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, url, image_url, price, description, category } = body;

  if (!name || !name.trim()) {
    return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
  }

  const urlVal = validateUrl(url);
  if (!urlVal.valid) {
    return NextResponse.json({ error: urlVal.error }, { status: 400 });
  }

  // Find next position
  const { data: existing } = await supabase
    .from('products')
    .select('position')
    .eq('user_id', user.id)
    .order('position', { ascending: false })
    .limit(1);

  const nextPosition = existing && existing.length > 0 ? existing[0].position + 1 : 0;

  const { data: product, error } = await supabase
    .from('products')
    .insert({
      user_id: user.id,
      name: name.trim(),
      url: url.trim(),
      image_url: image_url || null,
      price: price ? price.trim() : null,
      description: description ? description.trim() : null,
      category: category ? category.trim() : null,
      position: nextPosition,
      is_active: true,
      click_count: 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Revalidate profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.username) {
    try {
      revalidatePath(`/${profile.username}`);
    } catch (revalErr) {
      console.warn('[API /api/products POST revalidatePath warning]', revalErr);
    }
  }

  return NextResponse.json({ product }, { status: 201 });
}
