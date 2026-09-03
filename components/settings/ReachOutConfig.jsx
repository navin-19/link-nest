'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Heading from '@/components/ui/Heading';
import { getValidMapEmbedUrl } from '@/utils/mapEmbed';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  ExternalLink,
  X,
  Loader2,
  Navigation,
} from 'lucide-react';

/**
 * ReachOutConfig: Dashboard settings component for configuring Google Maps Place ID,
 * address, embedded location preview, opening hours, and direct contact methods.
 */
export default function ReachOutConfig({ profile, onLocalProfileChange }) {
  const router = useRouter();

  // Place ID input state
  const [placeIdInput, setPlaceIdInput] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Loaded/Selected Location Preview Data
  const [locationPreview, setLocationPreview] = useState(null);

  // Ref to prevent duplicate auto-fetches for identical place ID
  const lastFetchedPlaceIdRef = useRef(null);

  // Additional Contact & Business Details Form
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
  const [mapError, setMapError] = useState(false);

  // Fetch Place details from API
  async function fetchLocationDetails(id, isInitialMount = false) {
    if (!id || !id.trim()) {
      if (!isInitialMount) {
        setError('Please enter a Google Maps Place ID.');
      }
      return null;
    }

    const cleanId = id.trim();
    lastFetchedPlaceIdRef.current = cleanId;
    setLoadingLocation(true);
    setError(null);
    setMapError(false);

    try {
      const res = await fetch(`/api/places/details?placeId=${encodeURIComponent(cleanId)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Unable to find this location. Please check the Place ID and try again.');
      }

      if (!data.place) {
        throw new Error('Unable to find this location. Please check the Place ID and try again.');
      }

      const place = data.place;
      const previewData = {
        place_id: place.place_id,
        name: place.name || 'Google Business Location',
        address: place.address || '',
        phone: place.phone || '',
        hours: place.hours || '',
        maps_url: place.maps_url || `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(place.place_id)}`,
      };

      setLocationPreview(previewData);
      setPlaceIdInput(place.place_id);

      // Auto-populate form fields if not already manually customized
      setFormData((prev) => ({
        ...prev,
        google_place_id: place.place_id,
        name: prev.name || place.name || '',
        address: prev.address || place.address || '',
        phone: prev.phone || place.phone || '',
        hours: prev.hours || place.hours || '',
        mapsUrl: place.maps_url || `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(place.place_id)}`,
      }));

      return previewData;
    } catch (err) {
      console.error('[Place ID fetch error]', err);
      if (!isInitialMount) {
        setError(err.message || 'Unable to find this location. Please check the Place ID and try again.');
        setLocationPreview(null);
      }
      return null;
    } finally {
      setLoadingLocation(false);
    }
  }

  // Initialize from profile & auto-load location if Place ID is saved
  useEffect(() => {
    if (profile) {
      const ro = profile.reach_out || {};
      const savedPlaceId = profile.google_place_id || ro.google_place_id || '';
      const address = ro.address || profile.google_business_address || '';
      const name = ro.name || profile.google_business_name || '';
      const mapsUrl =
        ro.mapsUrl ||
        profile.google_maps_url ||
        (savedPlaceId
          ? `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(savedPlaceId)}`
          : '');

      setFormData({
        name,
        address,
        mapsUrl,
        google_place_id: savedPlaceId,
        phone: ro.phone || '',
        email: ro.email || '',
        hours: ro.hours || '',
      });

      if (savedPlaceId) {
        setPlaceIdInput(savedPlaceId);
        // Automatically load location details when the settings page opens (only once per unique ID)
        if (lastFetchedPlaceIdRef.current !== savedPlaceId) {
          fetchLocationDetails(savedPlaceId, true);
        }
      } else if (name || address) {
        setLocationPreview({
          place_id: '',
          name: name || 'Google Business Location',
          address,
          phone: ro.phone || '',
          hours: ro.hours || '',
          maps_url: mapsUrl,
        });
      }
    }
  }, [profile]);

  // Handle Load Location Button
  async function handleLoadLocation(e) {
    if (e) e.preventDefault();
    if (!placeIdInput.trim()) {
      setError('Please enter a Google Maps Place ID.');
      return;
    }
    await fetchLocationDetails(placeIdInput.trim(), false);
  }

  // Clear Selected Place ID & Location
  function handleClearLocation() {
    setPlaceIdInput('');
    setLocationPreview(null);
    setError(null);
    setFormData((prev) => ({
      ...prev,
      google_place_id: '',
      mapsUrl: '',
    }));
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

  async function persistData(dataToSave) {
    setSaving(true);
    setError(null);
    setMessage(null);

    const placeIdToSave = dataToSave.google_place_id?.trim() || null;

    const cleaned = {
      name: dataToSave.name?.trim() || '',
      address: dataToSave.address?.trim() || '',
      mapsUrl:
        dataToSave.mapsUrl?.trim() ||
        (placeIdToSave
          ? `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(placeIdToSave)}`
          : ''),
      google_place_id: placeIdToSave,
      phone: dataToSave.phone?.trim() || '',
      email: dataToSave.email?.trim() || '',
      hours: dataToSave.hours?.trim() || '',
    };

    const hasData = Object.values(cleaned).some((v) => Boolean(v));
    const reachOutPayload = hasData ? cleaned : null;

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reach_out: reachOutPayload,
          google_place_id: placeIdToSave,
          show_google_reviews: Boolean(placeIdToSave),
          google_business_name: cleaned.name || null,
          google_business_address: cleaned.address || null,
          google_maps_url: cleaned.mapsUrl || null,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to update Reach Us settings');

      if (onLocalProfileChange) {
        onLocalProfileChange({
          reach_out: reachOutPayload,
          google_place_id: placeIdToSave,
          show_google_reviews: Boolean(placeIdToSave),
          google_business_name: cleaned.name || null,
          google_business_address: cleaned.address || null,
          google_maps_url: cleaned.mapsUrl || null,
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
    await persistData(formData);
  }

  // Generate valid map embed URL for location preview
  const previewPlaceId = locationPreview?.place_id || formData.google_place_id;
  const previewQuery = formData.address || formData.name || locationPreview?.address || locationPreview?.name;
  const validEmbedUrl = getValidMapEmbedUrl(null, previewQuery, previewPlaceId);
  const directionsUrl =
    formData.mapsUrl ||
    locationPreview?.maps_url ||
    (previewPlaceId
      ? `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(previewPlaceId)}`
      : previewQuery
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(previewQuery)}`
      : '#');

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-6 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <Heading as="h3" className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin size={18} className="text-emerald-500" /> REACH US (Location & Business Hours)
          </Heading>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Connect your business using your Google Maps Place ID to display an embedded map, address, opening hours, and direct contact options on your public profile.
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

      {/* ── 1. Google Maps Place ID Input Section ──────────────────────────── */}
      <div className="space-y-3">
        <div className="space-y-1">
          <label htmlFor="google-place-id-input" className="text-xs font-bold text-slate-900 dark:text-white block">
            Google Maps Place ID
          </label>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Find your business on Google Maps, open the location, and copy its Place ID. (e.g. <span className="font-mono text-slate-700 dark:text-slate-300">ChIJN1t_tDeuEmsRUsoyG83frY4</span>)
          </p>
        </div>

        {/* Place ID Form */}
        <form onSubmit={handleLoadLocation} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="google-place-id-input"
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
              loading={loadingLocation}
              className="shadow-btn px-5 text-xs font-bold shrink-0 cursor-pointer"
            >
              {loadingLocation ? 'Loading...' : 'Load Location'}
            </Button>

            {locationPreview && (
              <button
                type="button"
                onClick={handleClearLocation}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors shrink-0 cursor-pointer"
                title="Clear location"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Loading Spinner */}
        {loadingLocation && (
          <div className="p-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2 rounded-2xl bg-slate-50 dark:bg-[#0d1020] border border-slate-200/80 dark:border-slate-800">
            <Loader2 size={16} className="animate-spin text-emerald-500" />
            <span>Validating Place ID and loading location details...</span>
          </div>
        )}

        {/* ── Location Preview Card ────────────────────────────────────────── */}
        {locationPreview && !loadingLocation && (
          <div className="p-5 rounded-3xl border border-emerald-500/30 bg-emerald-50/30 dark:bg-[#0c0f1d] shadow-sm space-y-4 animate-in fade-in">
            {/* Header / Business Name */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={13} /> Location Preview
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 pt-1">
                  <Building2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">{locationPreview.name || formData.name || 'Google Business Location'}</span>
                </h4>
                {(locationPreview.address || formData.address) && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
                    {locationPreview.address || formData.address}
                  </p>
                )}
              </div>

              {locationPreview.place_id && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0 hidden sm:inline-block">
                  {locationPreview.place_id.slice(0, 16)}...
                </span>
              )}
            </div>

            {/* Embedded Google Map Preview */}
            <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 relative shadow-inner flex items-center justify-center">
              {validEmbedUrl && !mapError ? (
                <iframe
                  src={validEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onError={() => setMapError(true)}
                  title={locationPreview.name || 'Google Map Preview'}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-900 via-[#16182c] to-slate-900 flex flex-col items-center justify-center text-center p-4 space-y-1.5 text-white">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-xs">
                    <MapPin size={18} />
                  </div>
                  <p className="text-xs font-bold text-white">{locationPreview.name}</p>
                  <p className="text-[11px] text-slate-300 line-clamp-1 max-w-[260px]">
                    {locationPreview.address}
                  </p>
                </div>
              )}
            </div>

            {/* Optional Hours & Phone Info Pills */}
            {(locationPreview.hours || locationPreview.phone) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                {locationPreview.phone && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-[#0d1020] border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    <Phone size={13} className="text-emerald-500 shrink-0" />
                    <span className="font-mono text-[11px] truncate">{locationPreview.phone}</span>
                  </div>
                )}
                {locationPreview.hours && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-[#0d1020] border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    <Clock size={13} className="text-amber-500 shrink-0" />
                    <span className="text-[11px] truncate">{locationPreview.hours}</span>
                  </div>
                )}
              </div>
            )}

            {/* Open in Google Maps Link */}
            {directionsUrl !== '#' && (
              <div className="pt-1 flex items-center justify-between">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 2. Contact & Business Details Form ────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Heading as="h4" className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Contact Details & Business Information
        </Heading>

        {/* Business Name */}
        <Input
          id="reachout-name"
          label="Business / Location Name"
          placeholder="e.g. Smart Marketing System"
          value={formData.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          leadingIcon={Building2}
        />

        {/* Physical Address */}
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
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs font-medium"
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
          placeholder="Mon-Sat · 9:00 AM - 8:00 PM"
          value={formData.hours}
          onChange={(e) => handleFieldChange('hours', e.target.value)}
          leadingIcon={Clock}
          hint="e.g. Mon-Sat · 9:00 AM - 8:00 PM, Sun: Closed"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Your Place ID and location details will be displayed in the Reach Us section of your public profile.
          </p>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={saving}
            className="shadow-btn hover:shadow-btn-hover text-xs font-bold px-6 py-2.5 cursor-pointer"
          >
            Save Reach Us Details
          </Button>
        </div>
      </form>
    </div>
  );
}
