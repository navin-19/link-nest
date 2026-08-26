import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { validateUsername, normalizeUsername } from '@/utils/validators';

async function handleProfileUpdate(request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.warn('[API /api/profile] Unauthorized access attempt:', authError?.message);
      return NextResponse.json(
        { error: 'Unauthorized: No active user session. Please sign in.' },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload in request body.' },
        { status: 400 }
      );
    }

    const updates = {};

    if (body.display_name !== undefined) {
      updates.display_name = body.display_name?.trim() || null;
    }

    if (body.bio !== undefined) {
      updates.bio = body.bio?.trim() || null;
    }

    if (body.avatar_url !== undefined) {
      updates.avatar_url = body.avatar_url || null;
    }

    if (body.avatar_layout !== undefined) {
      updates.avatar_layout = body.avatar_layout || 'classic';
    }

    if (body.title_style !== undefined) {
      updates.title_style = body.title_style || 'bold';
    }

    if (body.plan !== undefined) {
      updates.plan = body.plan || 'free';
    }

    if (body.theme_id !== undefined) {
      updates.theme_id = body.theme_id || null;
    }

    if (body.google_place_id !== undefined) {
      updates.google_place_id = body.google_place_id?.trim() || null;
    }

    if (body.show_google_reviews !== undefined) {
      updates.show_google_reviews = Boolean(body.show_google_reviews);
    }

    if (body.username !== undefined) {
      const rawUsername = normalizeUsername(body.username);
      const valid = validateUsername(rawUsername);
      if (!valid.valid) {
        return NextResponse.json({ error: valid.error }, { status: 400 });
      }

      // Check if new username is already taken by someone else
      const { data: existing, error: searchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', rawUsername)
        .neq('id', user.id)
        .maybeSingle();

      if (searchError) {
        console.error('[API /api/profile] Error checking username availability:', searchError);
        return NextResponse.json({ error: searchError.message }, { status: 500 });
      }

      if (existing) {
        return NextResponse.json(
          { error: 'Username is already taken by another account.' },
          { status: 400 }
        );
      }
      updates.username = rawUsername;
    }

    let { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select('*, themes!profiles_theme_id_fkey(*)')
      .single();

    // If an optional column like title_style or avatar_layout doesn't exist in remote schema cache,
    // fallback to core columns only
    if (updateError && updateError.code === 'PGRST204') {
      const coreUpdates = {};
      if (updates.display_name !== undefined) coreUpdates.display_name = updates.display_name;
      if (updates.avatar_url !== undefined) coreUpdates.avatar_url = updates.avatar_url;
      if (updates.bio !== undefined) coreUpdates.bio = updates.bio;
      if (updates.username !== undefined) coreUpdates.username = updates.username;
      if (updates.theme_id !== undefined) coreUpdates.theme_id = updates.theme_id;

      const fallbackRes = await supabase
        .from('profiles')
        .update(coreUpdates)
        .eq('id', user.id)
        .select('*, themes!profiles_theme_id_fkey(*)')
        .single();

      profile = fallbackRes.data;
      updateError = fallbackRes.error;
    }

    if (updateError) {
      console.error('[API /api/profile] Supabase update error:', updateError);
      return NextResponse.json(
        { error: updateError.message || 'Database error updating profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile });
  } catch (err) {
    console.error('[API /api/profile] Unexpected exception:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  return handleProfileUpdate(request);
}

export async function PATCH(request) {
  return handleProfileUpdate(request);
}
