import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabaseServer';
import { OFFICIAL_PRESET_THEMES } from '@/utils/presetThemes';

export async function GET() {
  const supabase = await createClient();

  try {
    const { data: dbThemes, error } = await supabase
      .from('themes')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('[API /api/themes GET db error - returning official presets]:', error.message);
      return NextResponse.json({ themes: OFFICIAL_PRESET_THEMES });
    }

    // Merge ensuring all 6 official presets are available in exact order
    const presetMap = new Map();
    OFFICIAL_PRESET_THEMES.forEach((p) => presetMap.set(p.id, p));

    (dbThemes || []).forEach((t) => {
      if (presetMap.has(t.id)) {
        presetMap.set(t.id, t);
      }
    });

    const themes = Array.from(presetMap.values());
    return NextResponse.json({ themes });
  } catch (err) {
    console.error('[API /api/themes GET exception]:', err);
    return NextResponse.json({ themes: OFFICIAL_PRESET_THEMES });
  }
}

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { name, background, button_style, font, text_color } = body || {};

  const insertPayload = {
    user_id: user.id,
    name: name || 'My Custom Theme',
    background: background || { type: 'solid', value: '#ffffff' },
    button_style: button_style || 'rounded',
    font: font || 'Inter',
  };
  if (text_color !== undefined) {
    insertPayload.text_color = text_color;
  }

  const { data: theme, error } = await supabase
    .from('themes')
    .insert(insertPayload)
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
