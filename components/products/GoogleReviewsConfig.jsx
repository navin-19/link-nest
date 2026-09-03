'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Star,
  CheckCircle2,
  AlertCircle,
  Building2,
  Loader2,
  RefreshCw,
  ExternalLink,
  MapPin,
  Check,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Heading from '@/components/ui/Heading';

/**
 * GoogleIcon: Multicolor official Google G logo
 */
function GoogleIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="shrink-0 drop-shadow-2xs"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function GoogleReviewsConfig({ profile, onLocalProfileChange }) {
  const router = useRouter();

  // Saved place ID from Reach Us or profile
  const reachOutPlaceId = profile?.reach_out?.google_place_id || '';
  const initialPlaceId = profile?.google_place_id || reachOutPlaceId || '';

  const [placeIdInput, setPlaceIdInput] = useState(initialPlaceId);
  const [showReviews, setShowReviews] = useState(profile?.show_google_reviews !== false && Boolean(initialPlaceId));

  // Display Settings Controls
  const [showRating, setShowRating] = useState(
    profile?.google_reviews_config?.show_rating !== false
  );
  const [reviewLimit, setReviewLimit] = useState(
    profile?.google_reviews_config?.limit || 5
  );
  const [showLogo, setShowLogo] = useState(
    profile?.google_reviews_config?.show_logo !== false
  );

  const [loadingReviews, setLoadingReviews] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Ref to prevent duplicate auto-fetches on profile re-render
  const lastFetchedReviewsPlaceIdRef = useRef(null);

  // Sync state when profile changes
  useEffect(() => {
    if (profile) {
      const currentPlaceId = profile.google_place_id || profile.reach_out?.google_place_id || '';
      setPlaceIdInput(currentPlaceId);
      setShowReviews(Boolean(profile.show_google_reviews));

      if (profile.google_reviews_config) {
        setShowRating(profile.google_reviews_config.show_rating !== false);
        setReviewLimit(profile.google_reviews_config.limit || 5);
        setShowLogo(profile.google_reviews_config.show_logo !== false);
      }

      // If place ID is saved, auto-load reviews preview (only once per unique ID)
      if (currentPlaceId && lastFetchedReviewsPlaceIdRef.current !== currentPlaceId) {
        fetchReviews(currentPlaceId, false, true);
      }
    }
  }, [profile]);

  async function fetchReviews(targetPlaceId, isRefresh = false, isInitialMount = false) {
    if (!targetPlaceId || !targetPlaceId.trim()) {
      if (!isInitialMount) {
        setError('Please enter a Google Maps Place ID.');
      }
      return null;
    }

    const cleanId = targetPlaceId.trim();
    lastFetchedReviewsPlaceIdRef.current = cleanId;
    if (isRefresh) setRefreshing(true);
    else setLoadingReviews(true);

    setError(null);

    try {
      const refreshParam = isRefresh ? '&refresh=true' : '';
      const res = await fetch(`/api/reviews?placeId=${encodeURIComponent(cleanId)}${refreshParam}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "We couldn't find this Google Business location. Please check the Place ID.");
      }

      setPreviewData(data);
      if (isRefresh) {
        setMessage('Reviews refreshed from Google!');
        setTimeout(() => setMessage(null), 3000);
      }
      return data;
    } catch (err) {
      console.error('[Google Reviews fetch error]', err);
      if (!isInitialMount) {
        setError(err.message || 'Unable to load Google Reviews right now. Please try again later.');
        setPreviewData(null);
      }
      return null;
    } finally {
      setLoadingReviews(false);
      setRefreshing(false);
    }
  }

  async function handleLoadReviews(e) {
    if (e) e.preventDefault();
    if (!placeIdInput.trim()) {
      setError('Please enter a Google Maps Place ID.');
      return;
    }
    await fetchReviews(placeIdInput.trim(), false, false);
  }

  async function handleRefreshReviews() {
    const idToRefresh = placeIdInput.trim() || profile?.google_place_id;
    if (!idToRefresh) return;
    await fetchReviews(idToRefresh, true, false);
  }

  function handleUseReachOutPlaceId() {
    if (reachOutPlaceId) {
      setPlaceIdInput(reachOutPlaceId);
      fetchReviews(reachOutPlaceId, false, false);
    }
  }

  async function persistSettings(newShowReviews, newLimit, newShowRating, newShowLogo) {
    setSaving(true);
    setMessage(null);
    setError(null);

    const cleanPlaceId = placeIdInput.trim() || null;
    const finalShowReviews = newShowReviews !== undefined ? newShowReviews : showReviews;
    const finalLimit = newLimit !== undefined ? newLimit : reviewLimit;
    const finalShowRating = newShowRating !== undefined ? newShowRating : showRating;
    const finalShowLogo = newShowLogo !== undefined ? newShowLogo : showLogo;

    const configPayload = {
      show_rating: finalShowRating,
      limit: finalLimit,
      show_logo: finalShowLogo,
    };

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          google_place_id: cleanPlaceId,
          show_google_reviews: cleanPlaceId ? finalShowReviews : false,
          google_reviews_config: configPayload,
          google_rating: previewData?.rating || null,
          google_review_count: previewData?.totalReviews || null,
          google_reviews: previewData?.reviews || null,
          google_reviews_last_updated: new Date().toISOString(),
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Failed to update Google Reviews settings');
      }

      if (onLocalProfileChange) {
        onLocalProfileChange({
          google_place_id: cleanPlaceId,
          show_google_reviews: cleanPlaceId ? finalShowReviews : false,
          google_reviews_config: configPayload,
          google_rating: previewData?.rating || null,
          google_review_count: previewData?.totalReviews || null,
          google_reviews: previewData?.reviews || null,
        });
      }

      router.refresh();
      setMessage('Google Reviews settings saved successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save Google Reviews settings');
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await persistSettings(showReviews, reviewLimit, showRating, showLogo);
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-6 text-slate-900 dark:text-slate-100">
      {/* Header with Switch */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <Heading as="h3" className="text-base font-bold flex items-center gap-2">
            <Star size={18} className="text-amber-500 fill-amber-500" /> GOOGLE REVIEWS
          </Heading>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Display your official Google star ratings and verified customer reviews on your public profile.
          </p>
        </div>

        {/* Master ON/OFF Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showReviews}
            onChange={(e) => {
              const checked = e.target.checked;
              setShowReviews(checked);
              persistSettings(checked, reviewLimit, showRating, showLogo);
            }}
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

      {/* ── Reach Us Place ID Shortcut Banner ──────────────────────────────── */}
      {reachOutPlaceId && reachOutPlaceId !== placeIdInput && (
        <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300 truncate">
              Use existing Reach Us Place ID: <strong className="font-mono text-slate-900 dark:text-white">{reachOutPlaceId}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={handleUseReachOutPlaceId}
            className="inline-flex items-center gap-1 font-bold text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline shrink-0 cursor-pointer self-end sm:self-auto"
          >
            <Check size={13} /> Use This Place ID
          </button>
        </div>
      )}

      {/* ── 1. Google Maps Place ID Input Section ──────────────────────────── */}
      <div className="space-y-3">
        <div className="space-y-1">
          <label htmlFor="reviews-place-id-input" className="text-xs font-bold text-slate-900 dark:text-white block">
            Google Maps Place ID
          </label>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Paste your Google Maps Place ID to load your business reviews from Google. (e.g. <span className="font-mono text-slate-700 dark:text-slate-300">ChIJN1t_tDeuEmsRUsoyG83frY4</span>)
          </p>
        </div>

        <form onSubmit={handleLoadReviews} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Star size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="reviews-place-id-input"
              type="text"
              value={placeIdInput}
              onChange={(e) => {
                setPlaceIdInput(e.target.value);
                setError(null);
              }}
              placeholder="Paste your Google Maps Place ID here..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={loadingReviews}
              className="shadow-btn px-5 text-xs font-bold shrink-0 cursor-pointer"
            >
              {loadingReviews ? 'Loading...' : 'Load Reviews'}
            </Button>
          </div>
        </form>

        {/* Loading Spinner */}
        {loadingReviews && (
          <div className="p-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2 rounded-2xl bg-slate-50 dark:bg-[#0d1020] border border-slate-200/80 dark:border-slate-800">
            <Loader2 size={16} className="animate-spin text-amber-500" />
            <span>Validating Place ID and loading customer reviews...</span>
          </div>
        )}

        {/* ── 2. Admin Review Preview Card ─────────────────────────────────── */}
        {previewData && !loadingReviews && (
          <div className="p-5 rounded-3xl border border-amber-500/30 bg-amber-50/20 dark:bg-[#0c0f1d] shadow-sm space-y-4 animate-in fade-in">
            {/* Header / Business & Rating summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-800">
              <div className="space-y-1 min-w-0">
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={13} /> Connected Google Business
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="truncate">{previewData.name}</span>
                </h4>
                <div className="flex items-center gap-2 pt-0.5">
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < Math.round(previewData.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-slate-300 dark:fill-slate-700 text-slate-300 dark:text-slate-700'
                          }
                        />
                      ))}
                    </div>
                    <span>{previewData.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    · {previewData.totalReviews} Google Reviews
                  </span>
                </div>
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={handleRefreshReviews}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer self-end sm:self-auto"
              >
                <RefreshCw size={13} className={refreshing ? 'animate-spin text-amber-500' : ''} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh Reviews'}</span>
              </button>
            </div>

            {/* Scrollable Review Cards Preview */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Review Preview ({previewData.reviews?.length || 0} loaded)
              </p>

              {previewData.reviews && previewData.reviews.length > 0 ? (
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {previewData.reviews.slice(0, reviewLimit).map((rev, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0d1020] space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {rev.profile_photo_url ? (
                            <img
                              src={rev.profile_photo_url}
                              alt={rev.author_name}
                              className="w-6 h-6 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 font-bold text-[10px] flex items-center justify-center shrink-0">
                              {rev.author_name ? rev.author_name.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {rev.author_name || 'Customer'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {rev.relative_time_description || 'Recently'}
                        </span>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, sIdx) => (
                          <Star
                            key={sIdx}
                            size={11}
                            className={
                              sIdx < (rev.rating || 5)
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-slate-200 dark:fill-slate-800 text-slate-200'
                            }
                          />
                        ))}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-2">
                        &ldquo;{rev.text}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-2">
                  No reviews returned from the official Google API for this location.
                </p>
              )}
            </div>

            {/* Google Maps link */}
            {previewData.googleMapsUrl && (
              <div className="pt-2 flex justify-end">
                <a
                  href={previewData.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  <span>View on Google Maps</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 3. Review Display Controls & Settings ─────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Heading as="h4" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Display Controls & Preferences
        </Heading>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Show Rating Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0d1020]">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Show Google Rating
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Display star score & total reviews count
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showRating}
                onChange={(e) => setShowRating(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
            </label>
          </div>

          {/* Show Google Logo Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0d1020]">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block flex items-center gap-1.5">
                <GoogleIcon size={14} /> Show Google Logo
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Official Google branding badge
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showLogo}
                onChange={(e) => setShowLogo(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
            </label>
          </div>
        </div>

        {/* Number of Reviews Control (3 / 5 / 10) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-900 dark:text-white block">
            Number of Reviews to Display
          </label>
          <div className="flex gap-2">
            {[3, 5, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setReviewLimit(num)}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  reviewLimit === num
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-white dark:bg-[#0d1020] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {num} Reviews
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            {showReviews && placeIdInput ? (
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
            size="md"
            loading={saving}
            className="shadow-btn hover:shadow-btn-hover text-xs font-bold px-6 py-2.5 cursor-pointer self-end sm:self-auto"
          >
            Save Google Reviews
          </Button>
        </div>
      </form>
    </div>
  );
}
