'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

/**
 * GoogleIcon: Multicolor official Google G logo
 */
function GoogleIcon({ size = 18 }) {
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

/**
 * GoogleReviewsSummary: Transparent glass pill containing Google rating, stars, count, and caption.
 * Clicking opens the Google Reviews page in a new tab.
 */
export default function GoogleReviewsSummary({ placeId, mapsUrl, preview = false }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!placeId) {
      setLoading(false);
      setData(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    async function loadReviews() {
      try {
        const res = await fetch(`/api/reviews?placeId=${encodeURIComponent(placeId.trim())}`);
        if (!res.ok) throw new Error('Failed to load Google reviews');
        const result = await res.json();
        if (isMounted) {
          setData(result);
        }
      } catch {
        if (isMounted) {
          setData(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadReviews();
    return () => {
      isMounted = false;
    };
  }, [placeId]);

  if (!placeId) return null;
  if (!loading && !data && !preview) return null;

  const rating = typeof data?.rating === 'number' ? data.rating : 4.9;
  const totalReviews = data?.totalReviews || (data ? 0 : 128);
  const roundedRating = Math.round(rating);

  const googleReviewTargetUrl =
    mapsUrl && mapsUrl.startsWith('http')
      ? mapsUrl
      : `https://search.google.com/local/reviews?placeid=${encodeURIComponent(placeId)}`;

  if (loading && !data && !preview) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center my-1 select-none">
      <a
        href={preview ? '#' : googleReviewTargetUrl}
        target={preview ? '_self' : '_blank'}
        rel="noopener noreferrer"
        onClick={(e) => {
          if (preview) e.preventDefault();
        }}
        title="View Google Reviews"
        className="group flex flex-col items-center gap-1 px-5 py-2 rounded-2xl bg-white/10 dark:bg-black/30 hover:bg-white/15 dark:hover:bg-black/45 border border-white/15 backdrop-blur-md shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      >
        {/* Rating row */}
        <div className="flex items-center gap-2">
          <GoogleIcon size={18} />
          <span className="text-sm font-bold text-white tracking-tight">{rating.toFixed(1)}</span>
          <div className="flex items-center gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                className={
                  i < roundedRating
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-white/20 text-white/20'
                }
              />
            ))}
          </div>
          <span className="text-xs text-white/75 group-hover:text-white transition-colors">({totalReviews})</span>
        </div>

        {/* Caption */}
        <span className="text-[10px] text-white/70 group-hover:text-white/90 tracking-wider uppercase font-semibold transition-colors">
          Google Reviews ↗
        </span>
      </a>
    </div>
  );
}
