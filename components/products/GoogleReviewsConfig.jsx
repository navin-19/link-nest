'use client';

import { useState, useEffect } from 'react';
import { Star, ExternalLink, CheckCircle2, AlertCircle, Building2, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function GoogleReviewsConfig({ profile, onLocalProfileChange }) {
  const [placeId, setPlaceId] = useState(profile?.google_place_id || '');
  const [showReviews, setShowReviews] = useState(Boolean(profile?.show_google_reviews));
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Sync state when profile updates
  useEffect(() => {
    if (profile) {
      setPlaceId(profile.google_place_id || '');
      setShowReviews(Boolean(profile.show_google_reviews));
    }
  }, [profile]);

  // Load preview data if saved Place ID exists
  useEffect(() => {
    if (!profile?.google_place_id) {
      setPreviewData(null);
      return;
    }

    let isMounted = true;
    async function fetchPreview() {
      try {
        const res = await fetch(`/api/reviews?placeId=${encodeURIComponent(profile.google_place_id)}`);
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
  }, [profile?.google_place_id]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const cleanPlaceId = placeId.trim();

    try {
      // 1. If user entered a Place ID, validate it with Google Reviews API first
      let resolvedPreview = null;
      if (cleanPlaceId) {
        setValidating(true);
        const testRes = await fetch(`/api/reviews?placeId=${encodeURIComponent(cleanPlaceId)}`);
        const testData = await testRes.json();

        if (!testRes.ok) {
          throw new Error(
            testData.error ||
              "We couldn't find a Google business for this Place ID. Please check the Place ID and try again."
          );
        }
        resolvedPreview = testData;
      }

      // 2. Save Place ID and visibility to the current authenticated user's profile
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          google_place_id: cleanPlaceId || null,
          show_google_reviews: cleanPlaceId ? showReviews : false,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update Google Reviews settings');
      }

      setPreviewData(resolvedPreview);

      if (onLocalProfileChange) {
        onLocalProfileChange({
          google_place_id: cleanPlaceId || null,
          show_google_reviews: cleanPlaceId ? showReviews : false,
        });
      }

      setMessage('✓ Google Review settings saved');
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      setValidating(false);
    }
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card space-y-6 text-slate-900 dark:text-slate-100">
      {/* Header with Switch */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2">
            <Star size={18} className="text-amber-500 fill-amber-500" /> Google Business Reviews
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Display your Google star rating and customer reviews on your public profile.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showReviews}
            onChange={(e) => setShowReviews(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900" />
        </label>
      </div>

      {message && (
        <div className="p-3.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 font-medium animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 font-medium animate-in fade-in">
          <AlertCircle size={16} className="text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Connected Business Live Preview Badge */}
      {previewData && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Building2 size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
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
            <span>Successfully connected to Google Business Profile</span>
          </p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <Input
            id="google-place-id"
            label="Google Place ID"
            placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
            value={placeId}
            onChange={(e) => setPlaceId(e.target.value)}
            leadingIcon={Star}
            hint="Enter your business Google Place ID to link your reviews."
          />
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Don&apos;t know your Place ID?</span>
            <a
              href="https://developers.google.com/maps/documentation/places/web-service/place-id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 font-semibold inline-flex items-center gap-0.5 hover:underline"
            >
              <span>Find it on Google Maps</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
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
            loading={saving || validating}
            className="shadow-btn hover:shadow-btn-hover self-end sm:self-auto cursor-pointer"
          >
            Save Review Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
