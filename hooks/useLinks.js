'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabaseClient';

/**
 * Hook for managing the current user's links.
 * Fetches, creates, updates, deletes, and reorders links.
 */
export function useLinks(userId, initialData = null) {
  const [links, setLinks] = useState(initialData || []);
  const [loading, setLoading] = useState(initialData === null);
  const [error, setError] = useState(null);

  const fetchLinks = useCallback(async () => {
    if (!userId) {
      setLinks([]);
      setLoading(false);
      return;
    }

    if (!initialData) {
      setLoading(true);
    }
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: err } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userId)
        .order('position', { ascending: true });

      if (err) {
        console.error('Failed to fetch links:', err);
        setError(err.message);
      } else {
        setLinks(data || []);
      }
    } catch (e) {
      console.error('Link fetch exception:', e);
      setError(e.message || 'Failed to fetch links');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const addLink = useCallback(async (linkData) => {
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(linkData),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to add link');
    const { link } = await res.json();
    setLinks((prev) => [...prev, link]);
    return link;
  }, []);

  const updateLink = useCallback(async (id, updates) => {
    const res = await fetch(`/api/links/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to update link');
    const { link } = await res.json();
    setLinks((prev) => prev.map((l) => (l.id === id ? link : l)));
    return link;
  }, []);

  const deleteLink = useCallback(async (id) => {
    const res = await fetch(`/api/links/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete link');
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const reorderLinks = useCallback(async (reordered) => {
    setLinks(reordered);
    await Promise.all(
      reordered.map((link, index) =>
        fetch(`/api/links/${link.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ position: index }),
        })
      )
    );
  }, []);

  return { links, loading, error, addLink, updateLink, deleteLink, reorderLinks, refetch: fetchLinks };
}
