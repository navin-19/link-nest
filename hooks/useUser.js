'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseClient';

/**
 * Hook that returns the current Supabase user and their profile.
 * Subscribes to auth state changes with guaranteed loading resolution.
 */
export function useUser() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const supabase = createClient();

        const { data: { user: authUser }, error } = await supabase.auth.getUser();

        if (error || !authUser) {
          if (isMounted) {
            setUser(null);
            setProfile(null);
            setLoading(false);
          }
          return;
        }

        if (isMounted) setUser(authUser);

        try {
          const { data: prof } = await supabase
            .from('profiles')
            .select('*, themes!profiles_theme_id_fkey(*)')
            .eq('id', authUser.id)
            .maybeSingle();

          if (isMounted) setProfile(prof || null);
        } catch (profErr) {
          console.warn('Profile fetch error:', profErr);
        }
      } catch (err) {
        console.warn('Auth check error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initAuth();

    try {
      const supabase = createClient();
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!isMounted) return;
        const currentAuthUser = session?.user ?? null;
        setUser(currentAuthUser);

        if (currentAuthUser) {
          try {
            const { data: prof } = await supabase
              .from('profiles')
              .select('*, themes!profiles_theme_id_fkey(*)')
              .eq('id', currentAuthUser.id)
              .maybeSingle();

            if (isMounted) setProfile(prof || null);
          } catch {
            // Ignore
          }
        } else {
          setProfile(null);
        }
        setLoading(false);
      });

      return () => {
        isMounted = false;
        subscription?.unsubscribe();
      };
    } catch {
      if (isMounted) setLoading(false);
    }
  }, []);

  return { user, profile, loading };
}
