'use client';

import { useState } from 'react';
import { MapPin, Navigation, Clock, Phone, Mail, ChevronRight } from 'lucide-react';
import { buttonStyles } from '@/components/links/buttonStyles';

/**
 * Extracts and validates a genuine Google Maps embed URL.
 * Rejects regular non-embed share URLs to prevent connection-refused browser errors.
 */
export function getValidMapEmbedUrl(rawUrl, fallbackQuery = '') {
  if (rawUrl && typeof rawUrl === 'string') {
    let url = rawUrl.trim();
    // Extract URL from raw iframe string if user pasted <iframe src="...">
    const iframeMatch = url.match(/src=["']([^"']+)["']/i);
    if (iframeMatch) {
      url = iframeMatch[1];
    }

    // Must match genuine embed patterns
    if (
      url.startsWith('https://www.google.com/maps/embed') ||
      url.startsWith('https://maps.google.com/maps') ||
      url.includes('output=embed')
    ) {
      return url;
    }
  }

  // Construct trusted query embed URL if address or name query is provided
  if (fallbackQuery && typeof fallbackQuery === 'string' && fallbackQuery.trim()) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(fallbackQuery.trim())}&output=embed`;
  }

  return null;
}

/**
 * ReachOutSection: Displays business location, map, hours, and contact options.
 * Restyled to match the clean pill card language of Quick Links and Products.
 */
export default function ReachOutSection({
  reachOut,
  profile,
  buttonStyle = 'rounded',
  font,
  preview = false,
  contrastMode = 'light',
}) {
  const [mapError, setMapError] = useState(false);

  const data = reachOut || profile?.reach_out;

  if (
    !data ||
    (!data.address &&
      !data.mapEmbedUrl &&
      !data.phone &&
      !data.email &&
      !data.hours)
  ) {
    return null;
  }

  const isDark = contrastMode === 'dark';
  const customFontStyle = font ? { fontFamily: font } : {};
  const buttonClass = buttonStyles[buttonStyle] ?? buttonStyles.rounded;

  const { address, mapEmbedUrl, phone, email, hours } = data;
  const validEmbedUrl = getValidMapEmbedUrl(mapEmbedUrl, address);

  const directionsUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : '#';

  return (
    <section style={customFontStyle} className="w-full space-y-2.5">
      {/* Section Heading: 📍 REACH OUT */}
      <h3
        className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wide px-1 ${
          isDark ? 'text-white/70' : 'text-slate-700'
        }`}
      >
        <MapPin
          size={14}
          className={isDark ? 'text-white/80' : 'text-slate-700'}
          strokeWidth={2.5}
        />
        REACH OUT
      </h3>

      {/* Content Stack — Clean individual pills sitting directly on background */}
      <div className="w-full flex flex-col gap-2.5">
        {/* Valid Map Embed (Omitted if invalid/missing, never shows broken browser error) */}
        {validEmbedUrl && !mapError && (
          <div className="w-full h-40 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-2xs">
            <iframe
              src={validEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onError={() => setMapError(true)}
              title="Location Map"
            />
          </div>
        )}

        {/* Address & Get Directions Pill */}
        {address && (
          <a
            href={preview ? '#' : directionsUrl}
            target={preview ? '_self' : '_blank'}
            rel="noopener noreferrer"
            onClick={(e) => {
              if (preview) e.preventDefault();
            }}
            className={[
              'group flex items-center justify-between gap-3 w-full px-4 py-3 sm:px-5 sm:py-3.5',
              'font-semibold text-sm transition-all duration-150 ease-out',
              'hover:scale-[1.01] active:scale-[0.98] cursor-pointer select-none',
              buttonClass,
            ].join(' ')}
          >
            <span className="flex items-center justify-center w-6 h-6 shrink-0 transition-transform group-hover:scale-110">
              <Navigation size={18} className="shrink-0 drop-shadow-2xs text-current" />
            </span>
            <span className="flex-1 text-left truncate">{address}</span>
            <span className="shrink-0 text-xs font-bold opacity-70 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
              Directions <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </a>
        )}

        {/* Opening Hours Pill */}
        {hours && (
          <div
            className={[
              'flex items-center gap-3 w-full px-4 py-3 sm:px-5 sm:py-3.5',
              'font-semibold text-sm select-none',
              buttonClass,
            ].join(' ')}
          >
            <span className="flex items-center justify-center w-6 h-6 shrink-0">
              <Clock size={18} className="shrink-0 drop-shadow-2xs text-current" />
            </span>
            <span className="flex-1 text-left text-xs sm:text-sm font-medium">
              {hours}
            </span>
          </div>
        )}

        {/* Call Pill */}
        {phone && (
          <a
            href={preview ? '#' : `tel:${phone}`}
            onClick={(e) => {
              if (preview) e.preventDefault();
            }}
            className={[
              'group flex items-center justify-between gap-3 w-full px-4 py-3 sm:px-5 sm:py-3.5',
              'font-semibold text-sm transition-all duration-150 ease-out',
              'hover:scale-[1.01] active:scale-[0.98] cursor-pointer select-none',
              buttonClass,
            ].join(' ')}
          >
            <span className="flex items-center justify-center w-6 h-6 shrink-0 transition-transform group-hover:scale-110">
              <Phone size={18} className="shrink-0 drop-shadow-2xs text-current" />
            </span>
            <span className="flex-1 text-left truncate">Call: {phone}</span>
            <ChevronRight size={16} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </a>
        )}

        {/* Email Pill */}
        {email && (
          <a
            href={preview ? '#' : `mailto:${email}`}
            onClick={(e) => {
              if (preview) e.preventDefault();
            }}
            className={[
              'group flex items-center justify-between gap-3 w-full px-4 py-3 sm:px-5 sm:py-3.5',
              'font-semibold text-sm transition-all duration-150 ease-out',
              'hover:scale-[1.01] active:scale-[0.98] cursor-pointer select-none',
              buttonClass,
            ].join(' ')}
          >
            <span className="flex items-center justify-center w-6 h-6 shrink-0 transition-transform group-hover:scale-110">
              <Mail size={18} className="shrink-0 drop-shadow-2xs text-current" />
            </span>
            <span className="flex-1 text-left truncate">Email: {email}</span>
            <ChevronRight size={16} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </a>
        )}
      </div>
    </section>
  );
}
