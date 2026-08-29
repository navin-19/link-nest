import { createClient, getAuthenticatedUser as getResilientUser } from './supabaseServer';

/**
 * Returns the current authenticated user's session (server-side).
 * Returns null if unauthenticated.
 */
export async function getSession() {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    if (!error && session) return session;
  } catch (e) {}
  return null;
}

/**
 * Returns the current authenticated user (server-side).
 * Returns null if unauthenticated.
 */
export async function getUser() {
  return getResilientUser();
}

/**
 * Returns the profile for the currently authenticated user.
 */
export async function getCurrentProfile() {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, themes!profiles_theme_id_fkey(*)')
    .eq('id', user.id)
    .single();

  return profile;
}

