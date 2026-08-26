import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { validateUrl } from '@/utils/validators';

export async function PATCH(request, { params }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const updates = {};

  if (body.name !== undefined) {
    if (!body.name.trim()) {
      return NextResponse.json({ error: 'Product name cannot be empty' }, { status: 400 });
    }
    updates.name = body.name.trim();
  }

  if (body.url !== undefined) {
    const urlVal = validateUrl(body.url);
    if (!urlVal.valid) {
      return NextResponse.json({ error: urlVal.error }, { status: 400 });
    }
    updates.url = body.url.trim();
  }

  if (body.image_url !== undefined) updates.image_url = body.image_url;
  if (body.price !== undefined) updates.price = body.price ? body.price.trim() : null;
  if (body.description !== undefined) updates.description = body.description ? body.description.trim() : null;
  if (body.is_active !== undefined) updates.is_active = Boolean(body.is_active);
  if (body.position !== undefined) updates.position = Number(body.position);

  const { data: product, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
