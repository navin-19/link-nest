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

    if (body.theme_id !== undefined) {
      updates.theme_id = body.theme_id || null;
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

    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select('*, themes!profiles_theme_id_fkey(*)')
      .single();

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
