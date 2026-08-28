import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabaseServer';
import { validateUrl, validateLinkTitle } from '@/utils/validators';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: links, error } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', user.id)
    .order('position', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ links });
}

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, url, icon, custom_style } = body;

  const titleVal = validateLinkTitle(title);
  if (!titleVal.valid) {
    return NextResponse.json({ error: titleVal.error }, { status: 400 });
  }

  const urlVal = validateUrl(url);
  if (!urlVal.valid) {
    return NextResponse.json({ error: urlVal.error }, { status: 400 });
  }

  // Get max current position
  const { data: existingLinks } = await supabase
    .from('links')
    .select('position')
    .eq('user_id', user.id)
    .order('position', { ascending: false })
    .limit(1);

  const nextPosition = existingLinks && existingLinks.length > 0
    ? existingLinks[0].position + 1
    : 0;

  const insertPayload = {
    user_id: user.id,
    title: title.trim(),
    url: url.trim(),
    icon: icon || null,
    position: nextPosition,
    is_active: true,
    click_count: 0,
  };

  if (custom_style !== undefined) {
    insertPayload.custom_style = custom_style;
  }

  const { data: link, error } = await supabase
    .from('links')
    .insert(insertPayload)
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
      console.warn('[API /api/links POST revalidatePath warning]', revalErr);
    }
  }

  return NextResponse.json({ link }, { status: 201 });
}
