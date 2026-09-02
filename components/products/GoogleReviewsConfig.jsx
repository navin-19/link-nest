'use client';

import { useState, useEffect } from 'react';
import { Star, CheckCircle2, AlertCircle, Building2, Search, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Heading from '@/components/ui/Heading';

export default function GoogleReviewsConfig({ profile, onLocalProfileChange }) {
  const [placeId, setPlaceId] = useState(profile?.google_place_id || '');
  const [showReviews, setShowReviews] = useState(Boolean(profile?.show_google_reviews));
  const [saving, setSaving] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  // Sync state when profile updates
  useEffect(() => {
    if (profile) {
      const currentPlaceId = profile.google_place_id || profile.reach_out?.google_place_id || '';
      setPlaceId(currentPlaceId);
      setShowReviews(Boolean(profile.show_google_reviews));
    }
  }, [profile]);

  // Load preview data if saved Place ID exists
  useEffect(() => {
    const targetPlaceId = profile?.google_place_id || profile?.reach_out?.google_place_id;
    if (!targetPlaceId) {
      setPreviewData(null);
      return;
    }

    let isMounted = true;
    async function fetchPreview() {
      try {
        const res = await fetch(`/api/reviews?placeId=${encodeURIComponent(targetPlaceId)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setPreviewData(data);
        } else {
          if (isMounted) setPreviewData(null);
        }
      } catch {
        if (isMounted) setPreviewData(null);
      }
    }

    fetchPreview();
    return () => {
      isMounted = false;
    };
  }, [profile?.google_place_id, profile?.reach_out?.google_place_id]);

  async function handleSearch(e) {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q || q.length < 2) return;

    setSearching(true);
    setError(null);
    try {
      const res = await fetch(`/api/places/search?query=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to search places');
      setSearchResults(data.results || []);
    } catch (err) {
      setError(err.message || 'Error searching Google Places');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }

  async function handleSelectBusiness(place) {
    setPlaceId(place.place_id);
    setShowReviews(true);
    setSearchResults([]);
    setShowSearch(false);
    setSearchQuery('');

    // Save to profile
    await persistSettings(place.place_id, true);
  }

  async function persistSettings(newPlaceId, newShowReviews) {
    setSaving(true);
    setMessage(null);
    setError(null);

    const cleanPlaceId = newPlaceId !== undefined ? newPlaceId.trim() : placeId.trim();
    const cleanShowReviews = newShowReviews !== undefined ? newShowReviews : showReviews;

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          google_place_id: cleanPlaceId || null,
          show_google_reviews: cleanPlaceId ? cleanShowReviews : false,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update Google Reviews settings');
      }

      if (cleanPlaceId) {
        try {
          const previewRes = await fetch(`/api/reviews?placeId=${encodeURIComponent(cleanPlaceId)}`);
          if (previewRes.ok) {
            const pData = await previewRes.json();
            setPreviewData(pData);
          }
        } catch {
          // ignore
        }
      } else {
        setPreviewData(null);
      }

      if (onLocalProfileChange) {
        onLocalProfileChange({
          google_place_id: cleanPlaceId || null,
          show_google_reviews: cleanPlaceId ? cleanShowReviews : false,
        });
      }

      setMessage('✓ Google Review settings saved');
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleReviews(checked) {
    setShowReviews(checked);
    await persistSettings(placeId, checked);
  }

  async function handleManualSave(e) {
    e.preventDefault();
    await persistSettings(placeId, showReviews);
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-6 text-slate-900 dark:text-slate-100">
      {/* Header with Switch */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <Heading as="h3" className="text-base font-bold flex items-center gap-2">
            <Star size={18} className="text-amber-500 fill-amber-500" /> Google Business Reviews
          </Heading>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Display your Google star rating and customer reviews on your public profile. Powered automatically by your selected business in Reach Us.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showReviews}
            onChange={(e) => handleToggleReviews(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
        </label>
      </div>

      {message && (
        <div className="p-3.5 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl flex items-center gap-2 font-medium animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-2xl flex items-center gap-2 font-medium animate-in fade-in">
          <AlertCircle size={16} className="text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Connected Business Live Preview Badge */}
      {previewData ? (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1020] border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Building2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {previewData.name}
              </span>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs shrink-0">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span>{previewData.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({previewData.totalReviews} reviews)</span>
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 size={12} />
            <span>Connected to Google Business Profile (Reviews are {showReviews ? 'Visible' : 'Hidden'})</span>
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
          <p>
            No Google Place ID linked yet. Search below or select your business in the <strong>Reach Us</strong> section to automatically link your reviews.
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="text-xs font-bold"
          >
            <Search size={13} className="mr-1" /> {showSearch ? 'Hide Search' : 'Search Business'}
          </Button>
        </div>
      )}

      {/* Optional Places Search inside Reviews tab */}
      {showSearch && (
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search business name on Google..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] text-xs"
            />
            <Button type="submit" variant="primary" size="sm" loading={searching} className="text-xs">
              Search
            </Button>
          </form>

          {searching && (
            <div className="p-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <Loader2 size={14} className="animate-spin text-emerald-500" />
              <span>Searching...</span>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map((place) => (
                <div
                  key={place.place_id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d1020] flex items-center justify-between text-xs gap-2"
                >
                  <div className="min-w-0">
                    <div className="font-bold truncate">{place.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{place.address}</div>
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => handleSelectBusiness(place)}
                    className="text-xs shrink-0"
                  >
                    Select
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Manual Place ID Input */}
      <form onSubmit={handleManualSave} className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
        <Input
          id="google-place-id"
          label="Google Place ID"
          placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
          value={placeId}
          onChange={(e) => setPlaceId(e.target.value)}
          leadingIcon={Star}
          hint="Automatically populated when you select a business from Google Maps."
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            {showReviews && placeId ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Reviews are visible on public profile</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span>Reviews are currently hidden</span>
              </>
            )}
          </span>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={saving}
            className="shadow-btn hover:shadow-btn-hover self-end sm:self-auto cursor-pointer"
          >
            Save Review Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
