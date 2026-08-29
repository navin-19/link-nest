import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabaseServer';
import { validateUsername, normalizeUsername } from '@/utils/validators';
import { OFFICIAL_PRESET_THEMES, getPresetThemeById } from '@/utils/presetThemes';

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

      // If theme_id is an official preset, guarantee it exists in themes table to avoid FK error
      if (updates.theme_id) {
        const preset = OFFICIAL_PRESET_THEMES.find((p) => p.id === updates.theme_id);
        if (preset) {
          await supabase
            .from('themes')
            .upsert({
              id: preset.id,
              user_id: null,
              name: preset.name,
              background: preset.background,
              button_style: preset.button_style,
              font: preset.font,
            }, { onConflict: 'id' })
            .select();
        }
      }
    }

    if (body.google_place_id !== undefined) {
      updates.google_place_id = body.google_place_id?.trim() || null;
    }

    if (body.show_google_reviews !== undefined) {
      updates.show_google_reviews = Boolean(body.show_google_reviews);
    }

    if (body.show_products !== undefined) {
      updates.show_products = Boolean(body.show_products);
    }

    if (body.social_links !== undefined) {
      updates.social_links = typeof body.social_links === 'object' && body.social_links !== null ? body.social_links : {};
    }

    if (body.reach_out !== undefined) {
      updates.reach_out = typeof body.reach_out === 'object' && body.reach_out !== null ? body.reach_out : null;
    }

    if (body.dashboard_card_background !== undefined) {
      updates.dashboard_card_background = body.dashboard_card_background || null;
    }

    if (body.customer_form_config !== undefined) {
      updates.customer_form_config = typeof body.customer_form_config === 'object' && body.customer_form_config !== null ? body.customer_form_config : null;
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

    // If theme foreign key error occurred, attempt auto-recovery
    if (updateError && updateError.message?.includes('profiles_theme_id_fkey') && updates.theme_id) {
      const preset = OFFICIAL_PRESET_THEMES.find((p) => p.id === updates.theme_id) || OFFICIAL_PRESET_THEMES[0];
      await supabase
        .from('themes')
        .upsert({
          id: preset.id,
          user_id: null,
          name: preset.name,
          background: preset.background,
          button_style: preset.button_style,
          font: preset.font,
        }, { onConflict: 'id' });

      const retryRes = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select('*, themes!profiles_theme_id_fkey(*)')
        .single();

      profile = retryRes.data;
      updateError = retryRes.error;
    }

    if (updateError) {
      console.error('[API /api/profile] Supabase update error:', updateError);
      return NextResponse.json(
        { error: updateError.message || 'Database error updating profile' },
        { status: 500 }
      );
    }

    // Attach resolved theme if null
    if (profile && !profile.themes && profile.theme_id) {
      profile.themes = getPresetThemeById(profile.theme_id);
    }

    // On-demand ISR revalidation so public page reflects changes instantly
    if (profile?.username) {
      try {
        revalidatePath(`/${profile.username}`);
      } catch (revalErr) {
        console.warn('[API /api/profile revalidatePath warning]:', revalErr);
      }
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
