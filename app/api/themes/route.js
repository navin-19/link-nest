import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabaseServer';

export async function GET() {
  const supabase = await createClient();
  const { data: themes, error } = await supabase
    .from('themes')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ themes });
}

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, background, button_style, font } = body;

  const { data: theme, error } = await supabase
    .from('themes')
    .insert({
      user_id: user.id,
      name: name || 'My Custom Theme',
      background: background || { type: 'solid', value: '#ffffff' },
      button_style: button_style || 'rounded',
      font: font || 'Inter',
    })
    .select()
    .single();

  if (error) {
    console.error('[API /api/themes POST error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Automatically attach newly created custom theme to user's profile
  const { data: updatedProfile, error: profileErr } = await supabase
    .from('profiles')
    .update({ theme_id: theme.id })
    .eq('id', user.id)
    .select('*, themes!profiles_theme_id_fkey(*)')
    .single();

  if (profileErr) {
    console.warn('[API /api/themes POST profile attach warning]', profileErr);
  }

  if (updatedProfile?.username) {
    try {
      revalidatePath(`/${updatedProfile.username}`);
    } catch (revalErr) {
      console.warn('[API /api/themes POST revalidatePath warning]', revalErr);
    }
  }

  return NextResponse.json({ theme, profile: updatedProfile }, { status: 201 });
}
