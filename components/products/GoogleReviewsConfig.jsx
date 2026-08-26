'use client';

import { useState } from 'react';
import { Star, ExternalLink, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function GoogleReviewsConfig({ profile, onLocalProfileChange }) {
  const [placeId, setPlaceId] = useState(profile?.google_place_id || '');
  const [showReviews, setShowReviews] = useState(Boolean(profile?.show_google_reviews));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          google_place_id: placeId.trim() || null,
          show_google_reviews: showReviews,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update Google Reviews settings');
      }

      if (onLocalProfileChange) {
        onLocalProfileChange({
          google_place_id: placeId.trim() || null,
          show_google_reviews: showReviews,
        });
      }

      setMessage('Google Reviews settings saved!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card space-y-5 text-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
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
        <div className="p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 font-medium">
          <CheckCircle2 size={15} /> {message}
        </div>
      )}

      {error && (
        <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 font-medium">
          <AlertCircle size={15} /> {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
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
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
            <span>Don&apos;t know your Place ID?</span>
            <a
              href="https://developers.google.com/maps/documentation/places/web-service/place-id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 font-semibold inline-flex items-center gap-0.5 hover:underline"
            >
              <span>Find it on Google Maps</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-400">
            {showReviews ? 'Reviews will be visible on your page' : 'Reviews are currently hidden'}
          </span>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={saving}
            className="shadow-btn hover:shadow-btn-hover"
          >
            Save Review Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
