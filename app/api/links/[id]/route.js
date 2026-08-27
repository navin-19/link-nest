import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { validateUrl, validateLinkTitle } from '@/utils/validators';

export async function PATCH(request, props) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const updates = {};

  if (body.title !== undefined) {
    const titleVal = validateLinkTitle(body.title);
    if (!titleVal.valid) return NextResponse.json({ error: titleVal.error }, { status: 400 });
    updates.title = body.title.trim();
  }

  if (body.url !== undefined) {
    const urlVal = validateUrl(body.url);
    if (!urlVal.valid) return NextResponse.json({ error: urlVal.error }, { status: 400 });
    updates.url = body.url.trim();
  }

  if (body.position !== undefined) {
    updates.position = parseInt(body.position, 10);
  }

  if (body.is_active !== undefined) {
    updates.is_active = Boolean(body.is_active);
  }

  if (body.icon !== undefined) {
    updates.icon = body.icon;
  }

  if (body.custom_style !== undefined) {
    updates.custom_style = body.custom_style;
  }

  const { data: link, error } = await supabase
    .from('links')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ link });
}

export async function DELETE(request, props) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('links')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
