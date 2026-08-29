'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseClient';

/**
 * Hook that returns the current Supabase user and their profile.
 *
 * Guarantees three clean states — loading is ALWAYS resolved immediately:
 *   { loading: true, user: null, profile: null }   — while checking session
 *   { loading: false, user: <User>, profile: ... }  — signed in
 *   { loading: false, user: null, profile: null }   — signed out or error
 */
export function useUser() {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let subscription = null;

    // Asynchronous non-blocking profile fetch
    async function fetchProfile(userId) {
      if (!userId) return;
      try {
        const supabase = createClient();
        const { data: prof, error } = await supabase
          .from('profiles')
          .select('*, themes!profiles_theme_id_fkey(*)')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.warn('[useUser] Profile query error:', error.message);
        }

        if (isMounted) {
          setProfile(prof ?? null);
        }
      } catch (profErr) {
        console.warn('[useUser] Profile fetch exception:', profErr);
      }
    }

    async function initAuth() {
      try {
        const supabase = createClient();

        // 1. Instant local session check (<1ms)
        const { data: { session }, error: sessionErr } = await supabase.auth.getSession();

        if (sessionErr) {
          console.warn('[useUser] getSession error:', sessionErr.message);
        }

        const initialUser = session?.user ?? null;

        if (!isMounted) return;

        // 2. Set user and resolve loading IMMEDIATELY (non-blocking)
        setUser(initialUser);
        setLoading(false);

        if (initialUser) {
          // Fetch profile asynchronously in background
          fetchProfile(initialUser.id);
        } else {
          setProfile(null);
        }

        // 3. Register Auth state change listener
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            if (!isMounted) return;

            const currentUser = currentSession?.user ?? null;
            setUser(currentUser);
            setLoading(false);

            if (currentUser) {
              fetchProfile(currentUser.id);
            } else {
              setProfile(null);
            }
          }
        );

        subscription = authListener?.subscription;
      } catch (err) {
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

