import { createClient } from './supabaseServer';

/**
 * Returns the current authenticated user's session (server-side).
 * Returns null if unauthenticated.
 */
export async function getSession() {
  const supabase = await createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) return null;
  return session;
}

/**
 * Returns the current authenticated user (server-side).
 * Returns null if unauthenticated.
 */
export async function getUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return null;
  return user;
}

/**
 * Returns the profile for the currently authenticated user.
 */
export async function getCurrentProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, themes!profiles_theme_id_fkey(*)')
    .eq('id', user.id)
    .single();

  return profile;
}
