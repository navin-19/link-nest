import { cache } from 'react';
import { createClient } from '@/lib/supabaseServer';

/**
 * Fetches profile data with joined theme for a given username using the
 * RLS-respecting server client (createClient). Wrapped in React cache()
 * to deduplicate requests between generateMetadata and the Page component.
 */
export const getProfileByUsername = cache(async (rawUsername) => {
  if (!rawUsername) return null;
  const username = rawUsername.toLowerCase();

  const supabase = await createClient();
  
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

  // 2. Resolve theme directly by theme_id if not populated
  if (!profile.themes && profile.theme_id) {
    const { data: directTheme } = await supabase
      .from('themes')
      .select('*')
      .eq('id', profile.theme_id)
      .maybeSingle();

    if (directTheme) {
      profile.themes = directTheme;
    }
  }

  // 3. Fallback: Use the first global preset theme if still not set
  if (!profile.themes) {
    const { data: defaultPreset } = await supabase
      .from('themes')
      .select('*')
      .is('user_id', null)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (defaultPreset) {
      profile.themes = defaultPreset;
    }
  }

  return profile;
});
