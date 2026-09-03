'use client';

import { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  Mail,
  Clock,
  Link2,
  FileText,
  ChevronRight,
  Star,
} from 'lucide-react';
import QuickActionPopup from '@/components/profile/QuickActionPopup';
import CustomerFormClient from '@/components/profile/CustomerFormClient';
import { getQuickLinksList } from '@/components/links/socialLinksHelper';
import { buttonStyles } from '@/components/links/buttonStyles';
import { getValidMapEmbedUrl } from '@/utils/mapEmbed';
import { resolveCustomerFormConfig } from '@/utils/customerFormConfig';

function WhatsAppGlyph({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

/**
 * QuickActionGroup: 3 buttons under "QUICK ACTION" heading:
 * 1. Contact Details (Blue pastel circle badge) -> Opens Contact Details modal
 * 2. Reach Us (Emerald pastel circle badge) -> Opens Reach Us modal
 * 3. Contact Form (Purple pastel circle badge) -> Opens Customer Form modal
 */
export default function QuickActionGroup({
  profile,
  formConfig: passedFormConfig,
  links = [],
  products = [],
  buttonStyle = 'rounded',
  font,
  username,
  preview = false,
  contrastMode = 'dark',
  activePopup,
  setActivePopup,
}) {
  const formConfig = passedFormConfig || resolveCustomerFormConfig(profile?.customer_form_config);
  const customFontStyle = font ? { fontFamily: font } : {};
  const isDark = contrastMode === 'dark';

  // 1. Contact Details Data (supports quick_links, social_links, and reach_out fallbacks)
  const effectiveQuickLinks = profile?.quick_links;
  const effectiveSocialLinks = profile?.social_links || {};
  const reachOut = profile?.reach_out;
  const activeLinks = getQuickLinksList(effectiveQuickLinks, effectiveSocialLinks, reachOut);

  // 2. Reach Us Data
  const businessName = reachOut?.name || profile?.google_business_name || profile?.display_name || '';
  const address = reachOut?.address || profile?.google_business_address || '';
  const phone = reachOut?.phone || '';
  const email = reachOut?.email || '';
  const hours = reachOut?.hours || '';
  const mapsUrl = reachOut?.mapsUrl || profile?.google_maps_url || '';
  const placeId = profile?.google_place_id || reachOut?.google_place_id;

  const queryForMap = address || businessName;
  const validEmbedUrl = getValidMapEmbedUrl(reachOut?.mapEmbedUrl, queryForMap, placeId);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    setMapError(false);
  }, [validEmbedUrl]);

  const directionsTarget =
    mapsUrl && (mapsUrl.startsWith('http://') || mapsUrl.startsWith('https://')) && !mapsUrl.includes('output=embed')
      ? mapsUrl
      : placeId
      ? `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(placeId)}`
      : address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      : businessName
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessName)}`
      : '#';

  // Dynamic card design from user's theme selection (buttonStyle), with theme-aware fallback
  const customCardClass = buttonStyle && buttonStyle !== 'rounded' && buttonStyles[buttonStyle] ? buttonStyles[buttonStyle] : null;
  const cardBaseClass = customCardClass || (isDark
    ? 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-white'
    : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-900 shadow-sm');

  const rowCardClass = isDark
    ? 'bg-slate-800/90 hover:bg-slate-700/80 border-slate-700 text-white'
    : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-900 shadow-xs';

  return (
    <div className="w-full flex flex-col space-y-2 pt-1">
      {/* ── Plain Centered Section Heading (No Underline) ────────────────────── */}
      <h2
        className={`text-center text-sm font-bold uppercase tracking-wide my-6 select-none ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}
      >
        QUICK ACTION
      </h2>

      {/* ── The 3 Buttons in Exact Order (Pastel circular badge + Label, Trailing Chevron) ───── */}
      <div className="w-full flex flex-col space-y-2">
        {/* BUTTON 1: Contact Details */}
        <button
          type="button"
          onClick={() => setActivePopup('quick-links')}
          aria-haspopup="dialog"
          aria-expanded={activePopup === 'quick-links'}
          style={customFontStyle}
          className={`group flex items-center justify-between w-full px-4 py-3 sm:px-4.5 sm:py-3.5 min-h-[56px] rounded-2xl border transition-all duration-150 ease-out hover:scale-[1.01] active:scale-[0.99] cursor-pointer select-none ${cardBaseClass}`}
        >
          {/* Left: Pastel circular icon badge + Label */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
              }`}
            >
              <Link2 size={18} className="shrink-0" />
            </div>
            <span className="font-semibold text-sm sm:text-base tracking-tight truncate text-left">
              Contact Details
            </span>
          </div>

          {/* Right: Chevron */}
          <ChevronRight
            size={18}
            className={`shrink-0 transition-transform group-hover:translate-x-0.5 ${
              isDark ? 'text-white/40' : 'text-slate-400'
            }`}
          />
        </button>

        {/* BUTTON 2: Reach Us */}
        <button
          type="button"
          onClick={() => setActivePopup('reach-us')}
          aria-haspopup="dialog"
          aria-expanded={activePopup === 'reach-us'}
          style={customFontStyle}
          className={`group flex items-center justify-between w-full px-4 py-3 sm:px-4.5 sm:py-3.5 min-h-[56px] rounded-2xl border transition-all duration-150 ease-out hover:scale-[1.01] active:scale-[0.99] cursor-pointer select-none ${cardBaseClass}`}
        >
          {/* Left: Pastel circular icon badge + Label */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
              }`}
            >
              <MapPin size={18} className="shrink-0" />
            </div>
            <span className="font-semibold text-sm sm:text-base tracking-tight truncate text-left">
              Reach Us
            </span>
          </div>

          {/* Right: Chevron */}
          <ChevronRight
            size={18}
            className={`shrink-0 transition-transform group-hover:translate-x-0.5 ${
              isDark ? 'text-white/40' : 'text-slate-400'
            }`}
          />
        </button>

        {/* BUTTON 3: Contact Form */}
        <button
          type="button"
          onClick={() => setActivePopup('content-form')}
          aria-haspopup="dialog"
          aria-expanded={activePopup === 'content-form'}
          style={customFontStyle}
          className={`group flex items-center justify-between w-full px-4 py-3 sm:px-4.5 sm:py-3.5 min-h-[56px] rounded-2xl border transition-all duration-150 ease-out hover:scale-[1.01] active:scale-[0.99] cursor-pointer select-none ${cardBaseClass}`}
        >
          {/* Left: Pastel circular icon badge + Label */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'
              }`}
            >
              <FileText size={18} className="shrink-0" />
            </div>
            <span className="font-semibold text-sm sm:text-base tracking-tight truncate text-left">
              Contact Form
            </span>
          </div>

          {/* Right: Chevron */}
          <ChevronRight
            size={18}
            className={`shrink-0 transition-transform group-hover:translate-x-0.5 ${
              isDark ? 'text-white/40' : 'text-slate-400'
            }`}
          />
        </button>
      </div>

      {/* ── POPUP 1: Contact Details Modal (Clickable Action Rows with Numbers/IDs) ── */}
      <QuickActionPopup
        isOpen={activePopup === 'quick-links'}
        onClose={() => setActivePopup(null)}
        title="Contact Details"
        subtitle="Direct links & contact options"
        preview={preview}
        contrastMode={contrastMode}
        font={font}
      >
        {activeLinks.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {activeLinks.map((link) => {
              const isDirectAction = link.url?.startsWith('mailto:') || link.url?.startsWith('tel:');
              const key = link.key || '';

              let iconBg = 'bg-indigo-500 text-white';
              let IconComponent = <Link2 size={18} className="shrink-0" />;

              if (key === 'whatsapp' || link.url?.includes('wa.me') || link.url?.includes('whatsapp.com')) {
                iconBg = 'bg-emerald-500 text-white';
                IconComponent = <WhatsAppGlyph size={18} className="shrink-0" />;
              } else if (key === 'phone' || link.url?.startsWith('tel:')) {
                iconBg = 'bg-sky-500 text-white';
                IconComponent = <Phone size={17} className="shrink-0" />;
              } else if (key === 'email' || link.url?.startsWith('mailto:')) {
                iconBg = 'bg-rose-500 text-white';
                IconComponent = <Mail size={17} className="shrink-0" />;
              }

              return (
                <a
                  key={link.id}
                  href={link.url}
                  target={isDirectAction ? '_self' : '_blank'}
                  rel={isDirectAction ? undefined : 'noopener noreferrer'}
                  onClick={(e) => {
                    if (preview) e.preventDefault();
                  }}
                  className={`group flex items-center justify-between w-full p-3.5 sm:p-4 rounded-2xl border transition-all duration-150 ease-out hover:scale-[1.01] active:scale-[0.99] cursor-pointer select-none ${rowCardClass}`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-xs shrink-0 transition-transform group-hover:scale-105 ${iconBg}`}>
                      {IconComponent}
                    </span>
                    <div className="flex flex-col text-left min-w-0">
                      <span className="font-semibold text-sm sm:text-base tracking-tight truncate">
                        {link.title}
                      </span>
                      {link.value && (
                        <span className={`text-xs truncate font-medium mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {link.value}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} className={`shrink-0 transition-transform group-hover:translate-x-0.5 ${isDark ? 'text-white/40' : 'text-slate-400'}`} />
                </a>
              );
            })}
          </div>
        ) : (
          <div className={`text-center py-8 space-y-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <p className="text-xs font-semibold">No contact details added yet</p>
            <p className="text-[11px] opacity-75">Add your contact methods in the Quick Action tab</p>
          </div>
        )}
      </QuickActionPopup>

      {/* ── POPUP 2: Reach Us Modal ─────────────────────────────────────────── */}
      <QuickActionPopup
        isOpen={activePopup === 'reach-us'}
        onClose={() => setActivePopup(null)}
        title="Reach Us"
        subtitle={businessName || 'Location & Contact'}
        preview={preview}
        contrastMode={contrastMode}
        font={font}
      >
        <div className="space-y-4">
          {/* Map Container */}
          <div className={`w-full h-44 rounded-2xl overflow-hidden border shadow-inner relative flex items-center justify-center ${
            isDark ? 'border-slate-700 bg-slate-950' : 'border-slate-200 bg-slate-900/80'
          }`}>
            {validEmbedUrl && !mapError ? (
              <iframe
                src={validEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                onError={() => setMapError(true)}
                title={businessName || 'Business Location'}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-900 via-[#16182c] to-slate-900 flex flex-col items-center justify-center text-center p-4 space-y-2 text-white">
                <div className="w-9 h-9 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shadow-xs">
                  <MapPin size={18} />
                </div>
                <div>
                  {businessName && <h5 className="text-xs font-bold text-white">{businessName}</h5>}
                  {address && <p className="text-[11px] text-slate-300 line-clamp-2 max-w-[240px]">{address}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Business Name & Address */}
          {(businessName || address) && (
            <div className="space-y-1">
              {businessName && (
                <h4 className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <MapPin size={15} className="text-orange-400 shrink-0" />
                  <span>{businessName}</span>
                </h4>
              )}
              {address && (
                <p className={`text-xs pl-5 leading-relaxed break-words font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {address}
                </p>
              )}
            </div>
          )}

          {/* Contact Details */}
          <div className={`space-y-2 text-xs border-t pt-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            {phone && (
              <div className="flex items-center gap-2.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  isDark ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-emerald-600'
                }`}>
                  <Phone size={12} />
                </div>
                <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{phone}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-2.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  isDark ? 'bg-slate-800 text-sky-400' : 'bg-slate-100 text-sky-600'
                }`}>
                  <Mail size={12} />
                </div>
                <span className={`break-all font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{email}</span>
              </div>
            )}
            {hours && (
              <div className="flex items-center gap-2.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  isDark ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-amber-600'
                }`}>
                  <Clock size={12} />
                </div>
                <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{hours}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className={`space-y-2 pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
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
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                      isDark
                        ? 'bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-white'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                    }`}
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
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                      isDark
                        ? 'bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-white'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                    } ${!phone ? 'col-span-2' : ''}`}
                  >
                    <Mail size={13} className="text-sky-500" />
                    <span>Email</span>
                  </a>
                ) : null}
              </div>
            )}

            {(profile?.google_place_id || reachOut?.google_place_id || mapsUrl) && (
              <a
                href={
                  preview
                    ? '#'
                    : profile?.google_place_id || reachOut?.google_place_id
                    ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(
                        profile?.google_place_id || reachOut?.google_place_id
                      )}`
                    : mapsUrl || '#'
                }
                target={preview ? '_self' : '_blank'}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (preview) e.preventDefault();
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <Star size={14} className="fill-white" />
                <span>Leave a Review on Google</span>
              </a>
            )}
          </div>
        </div>
      </QuickActionPopup>

      {/* ── POPUP 3: Customer Form Modal (Triggered by Contact Form Quick Action) ── */}
      <CustomerFormClient
        isOpen={activePopup === 'content-form'}
        onClose={() => setActivePopup(null)}
        profile={profile}
        formConfig={formConfig}
        username={username}
        preview={preview}
        contrastMode={contrastMode}
        font={font}
        buttonStyle={buttonStyle}
      />
    </div>
  );
}
