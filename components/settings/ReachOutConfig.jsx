'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Heading from '@/components/ui/Heading';
import {
  MapPin,
  Search,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Star,
  ExternalLink,
  X,
  Loader2,
} from 'lucide-react';

/**
 * ReachOutConfig: Dashboard settings component for searching & selecting Google Business,
 * address, Google Maps location, opening hours, and direct call/email actions.
 */
export default function ReachOutConfig({ profile, onLocalProfileChange }) {
  const router = useRouter();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Selected Business Data
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Additional Contact & Business Details
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mapsUrl: '',
    google_place_id: '',
    phone: '',
    email: '',
    hours: '',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const searchTimeoutRef = useRef(null);

  // Initialize from profile
  useEffect(() => {
    if (profile) {
      const ro = profile.reach_out || {};
      const placeId = profile.google_place_id || ro.google_place_id || '';
      const address = ro.address || profile.google_business_address || '';
      const name = ro.name || profile.google_business_name || '';
      const mapsUrl = ro.mapsUrl || profile.google_maps_url || (placeId ? `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${encodeURIComponent(placeId)}` : '');

      setFormData({
        name,
        address,
        mapsUrl,
        google_place_id: placeId,
        phone: ro.phone || '',
        email: ro.email || '',
        hours: ro.hours || '',
      });

      if (placeId || name || address) {
        setSelectedPlace({
          place_id: placeId,
          name: name || 'Google Business Location',
          address,
          maps_url: mapsUrl,
        });
      }
    }
  }, [profile]);

  // Execute Search
  async function handleSearch(e) {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q || q.length < 2) return;

    setSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/places/search?query=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to find businesses');
      setSearchResults(data.results || []);
    } catch (err) {
      console.error('[Places Search Error]', err);
      setError(err.message || 'Error searching Google Maps');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }

  // Handle Select Business
  async function handleSelectBusiness(place) {
    const updatedForm = {
      ...formData,
      name: place.name || '',
      address: place.address || '',
      google_place_id: place.place_id || '',
      mapsUrl: place.maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${encodeURIComponent(place.place_id)}`,
    };

    setFormData(updatedForm);
    setSelectedPlace(place);
    setSearchResults([]);
    setSearchQuery('');
    setHasSearched(false);

    // Auto-save on select
    await persistData(updatedForm, place.place_id);
  }

  // Clear Selected Business
  async function handleClearBusiness() {
    const updatedForm = {
      ...formData,
      name: '',
      address: '',
      google_place_id: '',
      mapsUrl: '',
    };
    setFormData(updatedForm);
    setSelectedPlace(null);
    await persistData(updatedForm, null);
  }

  function handleFieldChange(field, value) {
    const updated = {
      ...formData,
      [field]: value,
    };
    setFormData(updated);

    if (onLocalProfileChange) {
      onLocalProfileChange({
        reach_out: updated,
        google_place_id: updated.google_place_id || null,
        google_business_name: updated.name || null,
        google_business_address: updated.address || null,
        google_maps_url: updated.mapsUrl || null,
      });
    }
  }

  async function persistData(dataToSave, placeIdToSave) {
    setSaving(true);
    setError(null);
    setMessage(null);

    const cleaned = {
      name: dataToSave.name?.trim() || '',
      address: dataToSave.address?.trim() || '',
      mapsUrl: dataToSave.mapsUrl?.trim() || '',
      google_place_id: placeIdToSave || dataToSave.google_place_id?.trim() || null,
      phone: dataToSave.phone?.trim() || '',
      email: dataToSave.email?.trim() || '',
      hours: dataToSave.hours?.trim() || '',
    };

    const hasData = Object.values(cleaned).some((v) => Boolean(v));
    const reachOutPayload = hasData ? cleaned : null;
    const finalPlaceId = placeIdToSave !== undefined ? placeIdToSave : (cleaned.google_place_id || null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reach_out: reachOutPayload,
          google_place_id: finalPlaceId,
          show_google_reviews: Boolean(finalPlaceId),
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to update Reach Us settings');

      if (onLocalProfileChange) {
        onLocalProfileChange({
          reach_out: reachOutPayload,
          google_place_id: finalPlaceId,
          show_google_reviews: Boolean(finalPlaceId),
        });
      }

      router.refresh();
      setMessage('Reach Us details saved successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('[ReachOutConfig save error]', err);
      setError(err.message || 'Failed to save Reach Us details');
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await persistData(formData, formData.google_place_id);
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-6 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <Heading as="h3" className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin size={18} className="text-emerald-500" /> REACH US (Location & Business Hours)
          </Heading>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search and select your business from Google Maps to display an embedded map, address, opening hours, and direct contact options.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-3.5 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl flex items-center gap-2 font-medium">
          <CheckCircle2 size={16} className="shrink-0" /> {message}
        </div>
      )}

      {error && (
        <div className="p-3.5 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-2xl flex items-center gap-2 font-medium">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}

      {/* ── 1. Google Places Search & Select Section ──────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-900 dark:text-white block">
          Find your business on Google Maps
        </label>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search business name or address..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={searching}
            className="shadow-btn px-5 text-xs font-bold shrink-0"
          >
            <Search size={14} className="mr-1" /> Search
          </Button>
        </form>

        {/* Search Results List */}
        {searching && (
          <div className="p-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin text-emerald-500" />
            <span>Searching Google Places...</span>
          </div>
        )}

        {!searching && hasSearched && searchResults.length === 0 && (
          <div className="p-4 text-xs text-slate-500 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800">
            No businesses found matching &ldquo;{searchQuery}&rdquo;. You can also enter your address below manually.
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="space-y-2 pt-1 max-h-80 overflow-y-auto pr-1">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Matching Businesses
            </p>
            {searchResults.map((place) => (
              <div
                key={place.place_id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0d1020] hover:border-emerald-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MapPin size={14} className="text-emerald-500 shrink-0" />
                    <span className="truncate">{place.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 break-words leading-relaxed pl-5">
                    {place.address}
                  </p>
                  {place.rating > 0 && (
                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold pl-5 pt-0.5">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span>{place.rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">
                        · {place.user_ratings_total} reviews
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => handleSelectBusiness(place)}
                  className="shadow-btn text-xs font-bold shrink-0 self-end sm:self-auto"
                >
                  Select
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Selected Business Card */}
        {selectedPlace && (
          <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={13} /> Selected Google Business
              </span>
              <button
                type="button"
                onClick={handleClearBusiness}
                className="text-[11px] font-semibold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <X size={13} /> Change / Clear
              </button>
            </div>
            <div className="pl-0.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Building2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{selectedPlace.name}</span>
              </h4>
              {selectedPlace.address && (
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                  {selectedPlace.address}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── 2. Contact & Business Details Form ────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="space-y-1.5">
          <label htmlFor="reachout-address" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <MapPin size={14} /> Physical Address / Location
          </label>
          <textarea
            id="reachout-address"
            rows={2}
            placeholder="e.g. 123 Main Street, Chennai, Tamil Nadu"
            value={formData.address}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="reachout-phone"
            label="Direct Phone Number"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            leadingIcon={Phone}
          />

          <Input
            id="reachout-email"
            label="Business Email"
            placeholder="contact@yourbusiness.com"
            value={formData.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            leadingIcon={Mail}
          />
        </div>

        <Input
          id="reachout-hours"
          label="Opening Hours / Availability"
          placeholder="Mon-Sat · 9 AM - 8 PM"
          value={formData.hours}
          onChange={(e) => handleFieldChange('hours', e.target.value)}
          leadingIcon={Clock}
          hint="e.g. Mon-Sat · 9:00 AM - 8:00 PM, Sun: Closed"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Leave blank if you operate solely online without a physical location.
          </p>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={saving}
            className="shadow-btn hover:shadow-btn-hover text-xs font-bold px-6 py-2.5"
          >
            Save Reach Us Details
          </Button>
        </div>
      </form>
    </div>
  );
}
