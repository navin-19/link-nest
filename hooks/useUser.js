'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseClient';

/**
 * Hook that returns the current Supabase user and their profile.
 *
 * Guarantees three clean states — loading is ALWAYS resolved:
 *   { loading: true, user: null, profile: null }   — while checking
 *   { loading: false, user: <User>, profile: ... }  — signed in
 *   { loading: false, user: null, profile: null }   — signed out or any error
 *
 * Strategy:
 *   1. Call getUser() first (server-validated, not fooled by stale cookies).
 *   2. Set confirmed state from the server response.
 *   3. Only then subscribe to onAuthStateChange for subsequent events
 *      (sign-out, token refresh, etc.) so it can never race ahead of step 2.
 *   4. Any error anywhere → user: null, loading: false (signed-out is always
 *      the safe default; never leave loading stuck at true).
 */
export function useUser() {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let subscription = null;

    async function initAuth() {
      try {
        const supabase = createClient();

        // ── Step 1: Server-validated user check ──────────────────────────
        // getUser() makes a network request to Supabase's auth server.
        // It cannot be spoofed by a stale or forged local cookie.
        const { data: { user: authUser }, error } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (error || !authUser) {
          // Unauthenticated or error — always resolve to signed-out.
          setUser(null);
          setProfile(null);
          setLoading(false);
        } else {
          // Authenticated — set user, then try to fetch profile.
          setUser(authUser);

          try {
            const { data: prof } = await supabase
              .from('profiles')
              .select('*, themes!profiles_theme_id_fkey(*)')
              .eq('id', authUser.id)
              .maybeSingle();

            if (isMounted) setProfile(prof ?? null);
          } catch (profErr) {
            console.warn('[useUser] Profile fetch error:', profErr);
            // Profile fetch failing is non-fatal — user is still authenticated.
          } finally {
            if (isMounted) setLoading(false);
          }
        }

        // ── Step 2: Subscribe AFTER server check resolves ────────────────
        // Starting the subscription here (after await) means onAuthStateChange
        // cannot fire with stale cookie data before we've set the confirmed
        // server-validated state above. This prevents the flash-of-wrong-state
        // race condition.
        if (!isMounted) return;

        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            if (!isMounted) return;

            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
              try {
                const { data: prof } = await supabase
                  .from('profiles')
                  .select('*, themes!profiles_theme_id_fkey(*)')
                  .eq('id', currentUser.id)
                  .maybeSingle();

                if (isMounted) setProfile(prof ?? null);
              } catch {
                // Non-fatal — keep stale profile rather than clearing it.
              }
            } else {
              setProfile(null);
            }

            if (isMounted) setLoading(false);
          }
        );

        subscription = authListener?.subscription;

      } catch (err) {
        // createClient() itself threw, or getUser() threw unexpectedly.
        // Always resolve to signed-out — never leave loading: true.
        console.warn('[useUser] Auth init error:', err);
        if (isMounted) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}
