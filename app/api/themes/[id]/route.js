import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function PATCH(request, props) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const updates = {};

  if (body.name !== undefined) updates.name = body.name;
  if (body.background !== undefined) updates.background = body.background;
  if (body.button_style !== undefined) updates.button_style = body.button_style;
  if (body.font !== undefined) updates.font = body.font;

  const { data: theme, error } = await supabase
    .from('themes')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('[API /api/themes/[id] PATCH error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Ensure user's profile is pointing to this theme
  await supabase
    .from('profiles')
    .update({ theme_id: id })
    .eq('id', user.id);

  return NextResponse.json({ theme });
}
