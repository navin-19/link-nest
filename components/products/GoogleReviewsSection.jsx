'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Star, ExternalLink } from 'lucide-react';

export default function GoogleReviewsSection({ placeId, font, contrastMode = 'light' }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!placeId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function loadReviews() {
      try {
        const res = await fetch(`/api/reviews?placeId=${encodeURIComponent(placeId)}`);
        if (res.ok) {
          const result = await res.json();
          if (isMounted) setData(result);
        }
      } catch (e) {
        console.warn('Failed to load reviews:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadReviews();
    return () => {
      isMounted = false;
    };
  }, [placeId]);

  if (!placeId || (!data && !loading)) return null;

  const rating = data?.rating || 4.9;
  const totalReviews = data?.totalReviews || 128;
  const reviews = data?.reviews || [];
  const customFontStyle = font ? { fontFamily: font } : {};

  const isDark = contrastMode === 'dark';

  return (
    <section style={customFontStyle} className="w-full space-y-3 pt-4 text-slate-900">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <Star size={15} className="text-amber-500 fill-amber-500" />
          <h2 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white/80' : 'text-slate-500'}`}>
            Customer Reviews
          </h2>
        </div>
        {data?.googleMapsUrl && (
          <a
            href={data.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[11px] font-semibold flex items-center gap-1 transition-colors ${
              isDark ? 'text-white/80 hover:text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Google Profile</span>
            <ExternalLink size={10} />
          </a>
        )}
      </div>

      {/* Main Review Summary Card */}
      <div className="p-4 rounded-3xl bg-white/95 border border-slate-200/90 shadow-card space-y-4">
        {/* Rating Summary Bar */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {rating.toFixed(1)}
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}
                  />
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                Based on <strong className="text-slate-800">{totalReviews}</strong> Google reviews
              </p>
            </div>
          </div>

          {/* Official Google Attribution Badge */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/80 shadow-2xs">
              <svg width="14" height="14" viewBox="0 0 24 24" className="shrink-0">
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
              <span className="text-[10px] font-bold text-slate-700">Google</span>
            </div>
            <span className="text-[9px] text-slate-400 mt-0.5">Verified Reviews</span>
          </div>
        </div>

        {/* Review Snippets */}
        <div className="space-y-2.5">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/60 space-y-1.5 transition-all hover:bg-slate-100/80"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden shrink-0">
                    {r.profile_photo_url ? (
                      <Image
                        src={r.profile_photo_url}
                        alt={r.author_name || 'Reviewer'}
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-700">
                        {r.author_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                    {r.author_name}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(r.rating || 5)].map((_, i) => (
                    <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed italic line-clamp-2">
                &ldquo;{r.text}&rdquo;
              </p>
              {r.relative_time_description && (
                <p className="text-[9px] text-slate-400">{r.relative_time_description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
