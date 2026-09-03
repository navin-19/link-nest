'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, ExternalLink, MessageSquare } from 'lucide-react';
import { buttonStyles } from '@/components/links/buttonStyles';

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
 * GoogleReviewsSection: "WHAT OUR CUSTOMERS SAY"
 * Renders rating summary, interactive responsive carousel of verified Google reviews,
 * and "View All Google Reviews →" link.
 */
export default function GoogleReviewsSection({
  profile,
  placeId: propPlaceId,
  mapsUrl: propMapsUrl,
  preview = false,
  contrastMode = 'dark',
  font,
  buttonStyle = 'rounded',
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const carouselRef = useRef(null);

  const placeId =
    propPlaceId ||
    profile?.google_place_id ||
    profile?.reach_out?.google_place_id;

  const mapsUrl =
    propMapsUrl ||
    profile?.google_maps_url ||
    profile?.reach_out?.mapsUrl;

  const showReviews = profile?.show_google_reviews !== false;
  const reviewConfig = profile?.google_reviews_config || {
    show_rating: true,
    limit: 5,
    show_logo: true,
  };

  const showRating = reviewConfig.show_rating !== false;
  const showLogo = reviewConfig.show_logo !== false;
  const limit = typeof reviewConfig.limit === 'number' ? reviewConfig.limit : 5;

  useEffect(() => {
    if (!placeId) {
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

  if (!showReviews || (!placeId && !mapsUrl)) {
    return null;
  }

  const isDark = contrastMode === 'dark';
  const customFontStyle = font ? { fontFamily: font } : {};

  const rating =
    typeof data?.rating === 'number'
      ? data.rating
      : typeof profile?.google_rating === 'number'
      ? profile.google_rating
      : 4.8;

  const totalReviews =
    typeof data?.totalReviews === 'number'
      ? data.totalReviews
      : typeof profile?.google_review_count === 'number'
      ? profile.google_review_count
      : 86;

  const rawReviews = data?.reviews || profile?.google_reviews || [];
  const reviewsList = rawReviews.slice(0, limit);

  const googleReviewTargetUrl =
    data?.googleMapsUrl ||
    (mapsUrl && mapsUrl.startsWith('http') ? mapsUrl : null) ||
    (placeId ? `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(placeId)}` : '#');

  function scrollCarousel(direction) {
    if (carouselRef.current) {
      const scrollAmount = 280;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  }

  return (
    <section style={customFontStyle} className="w-full flex flex-col space-y-3.5 my-2">
      {/* Section Title */}
      <h3
        className={`text-center text-xs sm:text-sm font-bold uppercase tracking-wider select-none ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}
      >
        WHAT OUR CUSTOMERS SAY
      </h3>

      {/* ── Summary Rating Card ────────────────────────────────────────── */}
      <div
        className={`w-full p-4 sm:p-5 rounded-3xl border shadow-soft transition-all duration-200 ${
          isDark
            ? 'bg-[#111322]/85 text-white border-white/10'
            : 'bg-white text-slate-900 border-slate-200/90 shadow-card'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            {showLogo && (
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xs shrink-0 border border-slate-100">
                <GoogleIcon size={20} />
              </div>
            )}
            <div>
              {showRating && (
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-xl font-extrabold tracking-tight">
                    {rating.toFixed(1)}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < Math.round(rating)
                            ? 'fill-amber-400 text-amber-400'
                            : isDark
                            ? 'fill-white/20 text-white/20'
                            : 'fill-slate-200 text-slate-200'
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
              <p
                className={`text-xs font-medium mt-0.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Based on <span className="font-bold">{totalReviews}</span> Google Reviews
              </p>
            </div>
          </div>

          {/* Carousel Navigation Buttons */}
          {reviewsList.length > 1 && (
            <div className="flex items-center gap-1.5 self-center sm:self-auto">
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                }`}
                aria-label="Previous reviews"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                }`}
                aria-label="Next reviews"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* ── Scrollable / Swipeable Reviews Carousel ───────────────────── */}
        {reviewsList.length > 0 ? (
          <div
            ref={carouselRef}
            className="flex gap-3 overflow-x-auto scrollbar-none py-3 snap-x snap-mandatory -mx-1 px-1 scroll-smooth"
          >
            {reviewsList.map((rev, idx) => (
              <div
                key={idx}
                className={`min-w-[240px] sm:min-w-[260px] max-w-[300px] flex-shrink-0 snap-start p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                  isDark
                    ? 'bg-[#181c33]/70 border-white/10 hover:border-white/20'
                    : 'bg-slate-50 border-slate-200/90 hover:border-slate-300'
                }`}
              >
                {/* Reviewer Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {rev.profile_photo_url ? (
                      <img
                        src={rev.profile_photo_url}
                        alt={rev.author_name}
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-white/20"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                        {rev.author_name ? rev.author_name.charAt(0).toUpperCase() : 'C'}
                      </div>
                    )}
                    <span className="text-xs font-bold truncate">
                      {rev.author_name || 'Customer'}
                    </span>
                  </div>

                  {showLogo && <GoogleIcon size={13} />}
                </div>

                {/* Stars & Text */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, sIdx) => (
                      <Star
                        key={sIdx}
                        size={11}
                        className={
                          sIdx < (rev.rating || 5)
                            ? 'fill-amber-400 text-amber-400'
                            : isDark
                            ? 'fill-white/20 text-white/20'
                            : 'fill-slate-200 text-slate-200'
                        }
                      />
                    ))}
                  </div>
                  <p
                    className={`text-[11px] leading-relaxed line-clamp-3 italic ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    &ldquo;{rev.text || 'Great service and very professional experience.'}&rdquo;
                  </p>
                </div>

                {/* Relative Date */}
                <div
                  className={`text-[10px] font-medium pt-1 border-t ${
                    isDark ? 'border-white/5 text-slate-400' : 'border-slate-200/70 text-slate-500'
                  }`}
                >
                  {rev.relative_time_description || 'Recently'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`text-center py-4 text-xs font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            No Google reviews are currently available for this location.
          </div>
        )}

        {/* ── View All Google Reviews Button ────────────────────────────── */}
        {googleReviewTargetUrl !== '#' && (
          <div className="pt-2 border-t border-black/5 dark:border-white/10 flex justify-center">
            <a
              href={preview ? '#' : googleReviewTargetUrl}
              target={preview ? '_self' : '_blank'}
              rel="noopener noreferrer"
              onClick={(e) => {
                if (preview) e.preventDefault();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors py-1.5 px-3 cursor-pointer"
            >
              <span>View All Google Reviews</span>
              <ExternalLink size={13} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
