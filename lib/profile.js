import { cache } from 'react';
import { createClient } from '@supabase/supabase-js';
import { OFFICIAL_PRESET_THEMES, getPresetThemeById } from '@/utils/presetThemes';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

let publicClient;
function getPublicClient() {
  if (!publicClient && url && key) {
    publicClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return publicClient;
}

/**
 * Fetches profile data with joined theme for a given username.
 * Wrapped in React cache() to deduplicate requests between generateMetadata and Page component.
 */
export const getProfileByUsername = cache(async (rawUsername) => {
  if (!rawUsername) return null;
  const username = rawUsername.toLowerCase();

  const supabase = getPublicClient();
  if (!supabase) return null;

  // 1. Fetch profile with joined theme
  let { data: profile, error } = await supabase
    .from('profiles')
    .select('*, themes!profiles_theme_id_fkey(*)')
    .eq('username', username)
    .maybeSingle();

  // If join errored, fallback to standard profile select
  if (error || !profile) {
    const fallbackRes = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .maybeSingle();
    profile = fallbackRes.data;
  }

  if (!profile) return null;

  // 2. Resolve theme directly by theme_id if not populated from join
  if (!profile.themes && profile.theme_id) {
    const { data: directTheme } = await supabase
      .from('themes')
      .select('*')
      .eq('id', profile.theme_id)
      .maybeSingle();

    if (directTheme) {
      profile.themes = directTheme;
    } else {
      profile.themes = getPresetThemeById(profile.theme_id);
    }
  }

  // 3. Fallback: Use official preset theme (Ember) if still not set
  if (!profile.themes) {
    profile.themes = OFFICIAL_PRESET_THEMES[0];
  }

  return profile;
});
