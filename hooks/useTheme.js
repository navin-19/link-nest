'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';

/**
 * Hook for managing the current user's active theme.
 * Provides access to global presets and user-created themes with comprehensive error diagnostics.
 */
export function useTheme(profileThemeId) {
  const router = useRouter();
  const [themes, setThemes] = useState([]);
  const [activeTheme, setActiveTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchThemes() {
      try {
        const supabase = createClient();
        const { data, error: fetchErr } = await supabase
          .from('themes')
          .select('*')
          .order('created_at', { ascending: true });

        if (fetchErr) {
          console.warn('[useTheme] Error fetching themes:', fetchErr.message);
          if (isMounted) setError(fetchErr.message);
        } else if (isMounted) {
          setThemes(data || []);
          if (data && data.length > 0) {
            if (profileThemeId) {
              const found = data.find((t) => t.id === profileThemeId);
              setActiveTheme(found || data[0]);
            } else {
              // Default to first preset theme if user has not picked one yet
              setActiveTheme(data[0]);
            }
          }
        }
      } catch (err) {
        console.warn('[useTheme] Fetch exception:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchThemes();
    return () => {
      isMounted = false;
    };
  }, [profileThemeId]);

  /**
   * Apply a theme by updating the profile's theme_id scoped strictly to the current user.
   */
  const applyTheme = useCallback(async (themeId) => {
    setError(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme_id: themeId }),
      });

      if (!res.ok) {
        let errorDetails = '';
        try {
          const json = await res.json();
          errorDetails = json.error || JSON.stringify(json);
        } catch {
          errorDetails = await res.text().catch(() => 'no body');
        }

        const formattedError = `Failed to apply theme (HTTP ${res.status}): ${errorDetails || 'No details provided'}`;
        console.error('[useTheme.applyTheme error]', {
          status: res.status,
          statusText: res.statusText,
          details: errorDetails,
          requestedThemeId: themeId,
        });

        setError(formattedError);
        throw new Error(formattedError);
      }

      const { profile } = await res.json();
      const found = themes.find((t) => t.id === themeId) || profile?.themes;
      setActiveTheme(found || null);

      // Refresh router so layout, live preview, and page components re-sync immediately
      router.refresh();

      return profile;
    } catch (err) {
      console.error('[useTheme] Exception applying theme:', err);
      setError(err.message);
      throw err;
    }
  }, [themes, router]);

  /**
   * Create a new custom theme.
   */
  const createTheme = useCallback(async (themeData) => {
    setError(null);
    try {
      const supabase = createClient();
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) {
        throw new Error('You must be logged in to create a custom theme.');
      }

      const { data, error: insertError } = await supabase
        .from('themes')
        .insert({ ...themeData, user_id: user.id })
        .select()
        .single();

      if (insertError) {
        console.error('[useTheme.createTheme error]', insertError);
        throw new Error(`Failed to create theme: ${insertError.message}`);
      }

      setThemes((prev) => [...prev, data]);
      router.refresh();
      return data;
    } catch (err) {
      console.error('[useTheme] Exception creating theme:', err);
      setError(err.message);
      throw err;
    }
  }, [router]);

  /**
   * Update an existing custom theme.
   */
  const updateTheme = useCallback(async (themeId, themeData) => {
    setError(null);
    try {
      const supabase = createClient();
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) {
        throw new Error('You must be logged in to update a custom theme.');
      }

      const { data, error: updateError } = await supabase
        .from('themes')
        .update(themeData)
        .eq('id', themeId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('[useTheme.updateTheme error]', updateError);
        throw new Error(`Failed to update theme: ${updateError.message}`);
      }

      setThemes((prev) => prev.map((t) => (t.id === themeId ? data : t)));
      setActiveTheme(data);
      router.refresh();
      return data;
    } catch (err) {
      console.error('[useTheme] Exception updating theme:', err);
      setError(err.message);
      throw err;
    }
  }, [router]);

  const getThemeStyles = useCallback((theme) => {
    if (!theme) return {};
    const bg = theme.background;
    let background = '';

    if (bg?.type === 'solid') background = bg.value;
    else if (bg?.type === 'gradient') background = bg.value;
    else if (bg?.type === 'image') background = `url(${bg.value}) center/cover no-repeat`;

    return {
      background,
      fontFamily: theme.font || 'Inter',
    };
  }, []);

  return { themes, activeTheme, loading, error, applyTheme, createTheme, updateTheme, getThemeStyles };
}
