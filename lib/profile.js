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

  // Security: Use anon RLS-respecting server client (createClient) for public profile reads
  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*, themes!profiles_theme_id_fkey(*)')
    .eq('username', username)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile by username:', error);
    return null;
  }

  return profile;
});
