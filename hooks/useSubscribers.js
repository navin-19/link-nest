'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for managing the authenticated profile owner's subscriber leads.
 */
export function useSubscribers(userId) {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  const fetchSubscribers = useCallback(async () => {
    if (!userId) {
      setSubscribers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/subscribers');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to fetch subscribers');
      }
      const data = await res.json();
      setSubscribers(data.subscribers || []);
    } catch (e) {
      console.error('Subscriber fetch error:', e);
      setError(e.message || 'Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const deleteSubscriber = useCallback(async (id) => {
    const res = await fetch(`/api/subscribers?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to delete subscriber');
    }
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return {
    subscribers,
    loading,
    error,
    deleteSubscriber,
    refetch: fetchSubscribers,
  };
}

export default useSubscribers;
