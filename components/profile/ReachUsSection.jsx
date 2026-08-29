'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Phone, Mail, Clock, ChevronDown, ExternalLink } from 'lucide-react';
import { getValidMapEmbedUrl } from '@/utils/mapEmbed';
import { buttonStyles } from '@/components/links/buttonStyles';

export { getValidMapEmbedUrl };

export default function ReachUsSection({
  reachOut,
  profile,
  isExpanded = false,
  onToggle,
  buttonStyle = 'rounded',
  font,
  preview = false,
  contrastMode = 'dark',
}) {
  const [mapError, setMapError] = useState(false);

  const data = reachOut || profile?.reach_out;
  const placeId = profile?.google_place_id || data?.google_place_id;

  if (
    !data &&
    !placeId &&
    !profile?.google_business_name &&
    !profile?.google_business_address
  ) {
    return null;
  }

  const businessName = data?.name || profile?.google_business_name || profile?.display_name || '';
  const address = data?.address || profile?.google_business_address || '';
  const phone = data?.phone || '';
  const email = data?.email || '';
  const hours = data?.hours || '';
  const mapsUrl = data?.mapsUrl || profile?.google_maps_url || '';

  // If nothing is configured, don't render section
  if (!address && !businessName && !phone && !email && !hours && !mapsUrl) {
    return null;
  }

  const customFontStyle = font ? { fontFamily: font } : {};
  const buttonClass = buttonStyles[buttonStyle] ?? buttonStyles.rounded;

  // Construct safe embed URL from address or business name
  const queryForMap = address || businessName;
  const validEmbedUrl = getValidMapEmbedUrl(data?.mapEmbedUrl, queryForMap);

  // Directions target URL
  const directionsTarget =
    mapsUrl && (mapsUrl.startsWith('http://') || mapsUrl.startsWith('https://')) && !mapsUrl.includes('output=embed')
      ? mapsUrl
      : address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      : businessName
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessName)}`
      : '#';

  return (
    <section style={customFontStyle} className="w-full flex flex-col space-y-2">
      {/* Top Header Card: REACH US (Dynamically uses selected Card Design) */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls="reach-us-panel"
        style={customFontStyle}
        className={`grid grid-cols-[24px_1fr_24px] items-center w-full min-h-[52px] px-4 font-bold transition-all duration-200 cursor-pointer select-none text-left active:scale-[0.99] ${buttonClass}`}
      >
        {/* Left spacer for perfect centering */}
        <span className="w-6" aria-hidden="true" />

        {/* Center: Truly Centered REACH US Label */}
        <span className="text-center font-bold text-xs sm:text-sm uppercase tracking-wider truncate px-2">
          REACH US
        </span>

        {/* Right: Rotating Chevron */}
        <ChevronDown
          size={18}
          className={`justify-self-end opacity-75 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Expanded Accordion Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id="reach-us-panel"
            role="region"
            aria-label="Reach Us details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden w-full px-0.5"
          >
            <div className={`p-4 sm:p-5 rounded-3xl space-y-4 my-1 ${buttonClass}`}>
              {/* Google Map Container or Fallback */}
              <div className="w-full h-44 rounded-2xl overflow-hidden border border-white/15 shadow-inner bg-slate-900/80 relative flex items-center justify-center">
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
                    title={businessName || 'Business Location'}
                  />
                ) : (
                  /* Clean Fallback Card — Never shows technical embed warning */
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 via-[#16182c] to-slate-900 flex flex-col items-center justify-center text-center p-4 space-y-2 text-white">
                    <div className="w-9 h-9 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shadow-xs">
                      <MapPin size={18} />
                    </div>
                    <div>
                      {businessName && (
                        <h5 className="text-xs font-bold text-white">{businessName}</h5>
                      )}
                      {address && (
                        <p className="text-[11px] text-slate-300 line-clamp-1 max-w-[240px]">{address}</p>
                      )}
                    </div>
                    {directionsTarget !== '#' && (
                      <a
                        href={preview ? '#' : directionsTarget}
                        target={preview ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-400 hover:text-orange-300 hover:underline pt-1"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Business Name & Address Details */}
              {(businessName || address) && (
                <div className="space-y-1">
                  {businessName && (
                    <h4 className="text-sm font-bold flex items-center gap-1.5">
                      <MapPin size={15} className="text-orange-400 shrink-0" />
                      <span>{businessName}</span>
                    </h4>
                  )}
                  {address && (
                    <p className="text-xs opacity-80 pl-5 leading-relaxed break-words font-medium">
                      {address}
                    </p>
                  )}
                </div>
              )}

              {/* Contact Info Rows (Phone, Email, Hours) */}
              <div className="space-y-2 text-xs border-t border-black/10 dark:border-white/10 pt-3">
                {phone && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center shrink-0 text-emerald-500">
                      <Phone size={12} />
                    </div>
                    <span className="opacity-90 font-medium">{phone}</span>
                  </div>
                )}

                {email && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center shrink-0 text-sky-500">
                      <Mail size={12} />
                    </div>
                    <span className="opacity-90 break-all font-medium">{email}</span>
                  </div>
                )}

                {hours && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center shrink-0 text-amber-500">
                      <Clock size={12} />
                    </div>
                    <span className="opacity-90 font-medium">{hours}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons: Get Directions + Call/Email Pills */}
              <div className="space-y-2 pt-2 border-t border-black/10 dark:border-white/10">
                {directionsTarget !== '#' && (
                  <a
                    href={preview ? '#' : directionsTarget}
                    target={preview ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (preview) e.preventDefault();
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Navigation size={14} /> Get Directions
                  </a>
                )}

                {(phone || email) && (
                  <div className="grid grid-cols-2 gap-2">
                    {phone ? (
                      <a
                        href={preview ? '#' : `tel:${phone.replace(/[^\d+]/g, '')}`}
                        onClick={(e) => {
                          if (preview) e.preventDefault();
                        }}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 border border-black/10 dark:border-white/10 transition-colors"
                      >
                        <Phone size={13} className="text-emerald-500" />
                        <span>Call</span>
                      </a>
                    ) : null}

                    {email ? (
                      <a
                        href={preview ? '#' : `mailto:${email}`}
                        onClick={(e) => {
                          if (preview) e.preventDefault();
                        }}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 border border-black/10 dark:border-white/10 transition-colors ${
                          !phone ? 'col-span-2' : ''
                        }`}
                      >
                        <Mail size={13} className="text-sky-500" />
                        <span>Email</span>
                      </a>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
