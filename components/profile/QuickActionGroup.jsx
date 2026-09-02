'use client';

import { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  User,
  PhoneCall,
  Link2,
  FileText,
  ChevronRight,
  Star,
} from 'lucide-react';
import QuickActionPopup from '@/components/profile/QuickActionPopup';
import CustomerFormClient from '@/components/profile/CustomerFormClient';
import LinkButton from '@/components/links/LinkButton';
import ProductCard from '@/components/products/ProductCard';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Heading from '@/components/ui/Heading';
import { getQuickLinksList, getSocialLinksList } from '@/components/links/socialLinksHelper';
import { buttonStyles } from '@/components/links/buttonStyles';
import { getValidMapEmbedUrl } from '@/utils/mapEmbed';
import { resolveCustomerFormConfig } from '@/utils/customerFormConfig';

const COUNTRY_CODES = [
  { code: '+1', flag: '🇺🇸', name: 'US / Canada' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+55', flag: '🇧🇷', name: 'Brazil' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+27', flag: '🇿🇦', name: 'South Africa' },
  { code: '+63', flag: '🇵🇭', name: 'Philippines' },
  { code: '+60', flag: '🇲🇾', name: 'Malaysia' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
];

/**
 * QuickActionGroup: 4 buttons under "QUICK ACTION" heading:
 * 1. Quick Links (Blue accent circle)
 * 2. Reach Us (Emerald accent circle)
 * 3. Content Form (Purple accent circle) -> Opens Customer Form modal
 * 4. Call Back (Amber accent circle)
 * (Products & Services lives in its own section below Follow Us).
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
  const buttonClass = buttonStyles[buttonStyle] ?? buttonStyles.rounded;
  const isLight = contrastMode === 'light';

  // 1. Quick Links Data
  const effectiveQuickLinks = profile?.quick_links;
  const effectiveSocialLinks = profile?.social_links || {};
  const activeLinks = getQuickLinksList(effectiveQuickLinks, effectiveSocialLinks);

  // 2. Reach Us Data
  const reachOut = profile?.reach_out;
  const businessName = reachOut?.name || profile?.google_business_name || profile?.display_name || '';
  const address = reachOut?.address || profile?.google_business_address || '';
  const phone = reachOut?.phone || '';
  const email = reachOut?.email || '';
  const hours = reachOut?.hours || '';
  const mapsUrl = reachOut?.mapsUrl || profile?.google_maps_url || '';

  const queryForMap = address || businessName;
  const validEmbedUrl = getValidMapEmbedUrl(reachOut?.mapEmbedUrl, queryForMap);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    setMapError(false);
  }, [validEmbedUrl]);

  const directionsTarget =
    mapsUrl && (mapsUrl.startsWith('http://') || mapsUrl.startsWith('https://')) && !mapsUrl.includes('output=embed')
      ? mapsUrl
      : address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      : businessName
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessName)}`
      : '#';

  // 4. Call Back Data & State
  const [callBackName, setCallBackName] = useState('');
  const [callBackPhone, setCallBackPhone] = useState('');
  const [callBackCountryCode, setCallBackCountryCode] = useState('+1');
  const [callBackLoading, setCallBackLoading] = useState(false);
  const [callBackSubmitted, setCallBackSubmitted] = useState(false);
  const [callBackError, setCallBackError] = useState(null);
  const [callBackNameError, setCallBackNameError] = useState(null);
  const [callBackPhoneError, setCallBackPhoneError] = useState(null);

  async function handleCallBackSubmit(e) {
    e.preventDefault();
    setCallBackError(null);
    setCallBackNameError(null);
    setCallBackPhoneError(null);

    let hasClientError = false;
    if (!callBackName.trim()) {
      setCallBackNameError('Your name is required.');
      hasClientError = true;
    }

    if (!callBackPhone.trim()) {
      setCallBackPhoneError('Phone number is required.');
      hasClientError = true;
    } else {
      const phoneRegex = /^[\d+\-\s()]{6,20}$/;
      if (!phoneRegex.test(callBackPhone.trim())) {
        setCallBackPhoneError('Please enter a valid phone number.');
        hasClientError = true;
      }
    }

    if (hasClientError) return;

    setCallBackLoading(true);

    try {
      const payload = {
        username: username || profile?.username,
        source: 'callback',
        name: callBackName.trim(),
        mobileNumber: callBackPhone.trim(),
        countryCode: callBackCountryCode,
      };

      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        const errMsg = data.error || 'Failed to request call back';
        if (errMsg.toLowerCase().includes('name')) {
          setCallBackNameError(errMsg);
        } else if (errMsg.toLowerCase().includes('phone') || errMsg.toLowerCase().includes('mobile')) {
          setCallBackPhoneError(errMsg);
        } else {
          setCallBackError(errMsg);
        }
        return;
      }

      setCallBackSubmitted(true);
    } catch (err) {
      setCallBackError(err.message || 'Failed to request call back. Please try again.');
    } finally {
      setCallBackLoading(false);
    }
  }

  const countrySelectClass = isLight
    ? 'w-28 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-900 px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono shadow-xs'
    : 'w-28 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800/90 text-white px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono shadow-xs';

  return (
    <div className="w-full flex flex-col space-y-2 pt-1">
      {/* ── Umbrella Section Heading with Highlight & Underline ───────────────── */}
      <Heading
        as="h2"
        align="center"
        underline={true}
        className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-0.5 select-none"
      >
        Quick Action
      </Heading>

      {/* ── The 4 Buttons in Exact Order (Centered icon-in-circle + text, Trailing Chevron) ───── */}
      <div className="w-full flex flex-col space-y-2">
        {/* BUTTON 1: Quick Links */}
        <button
          type="button"
          onClick={() => setActivePopup('quick-links')}
          aria-haspopup="dialog"
          aria-expanded={activePopup === 'quick-links'}
          style={customFontStyle}
          className={`relative group w-full min-h-[52px] px-4 flex items-center justify-center text-center font-semibold text-xs sm:text-sm uppercase tracking-wide transition-all duration-150 cursor-pointer select-none active:scale-[0.99] ${buttonClass}`}
        >
          {/* Centered Icon + Label Group */}
          <div className="flex items-center justify-center gap-2.5 max-w-[80%]">
            <span className="w-7 h-7 rounded-full bg-blue-500/15 text-blue-500 dark:bg-blue-500/25 dark:text-blue-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
              <Link2 size={15} className="shrink-0" />
            </span>
            <span className="truncate leading-tight font-semibold">Quick Links</span>
          </div>

          {/* Trailing Chevron */}
          <ChevronRight size={16} className="absolute right-4 opacity-40 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* BUTTON 2: Reach Us */}
        <button
          type="button"
          onClick={() => setActivePopup('reach-us')}
          aria-haspopup="dialog"
          aria-expanded={activePopup === 'reach-us'}
          style={customFontStyle}
          className={`relative group w-full min-h-[52px] px-4 flex items-center justify-center text-center font-semibold text-xs sm:text-sm uppercase tracking-wide transition-all duration-150 cursor-pointer select-none active:scale-[0.99] ${buttonClass}`}
        >
          {/* Centered Icon + Label Group */}
          <div className="flex items-center justify-center gap-2.5 max-w-[80%]">
            <span className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-500 dark:bg-emerald-500/25 dark:text-emerald-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
              <MapPin size={15} className="shrink-0" />
            </span>
            <span className="truncate leading-tight font-semibold">Reach Us</span>
          </div>

          {/* Trailing Chevron */}
          <ChevronRight size={16} className="absolute right-4 opacity-40 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* BUTTON 3: Content Form */}
        <button
          type="button"
          onClick={() => setActivePopup('content-form')}
          aria-haspopup="dialog"
          aria-expanded={activePopup === 'content-form'}
          style={customFontStyle}
          className={`relative group w-full min-h-[52px] px-4 flex items-center justify-center text-center font-semibold text-xs sm:text-sm uppercase tracking-wide transition-all duration-150 cursor-pointer select-none active:scale-[0.99] ${buttonClass}`}
        >
          {/* Centered Icon + Label Group */}
          <div className="flex items-center justify-center gap-2.5 max-w-[80%]">
            <span className="w-7 h-7 rounded-full bg-purple-500/15 text-purple-500 dark:bg-purple-500/25 dark:text-purple-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
              <FileText size={15} className="shrink-0" />
            </span>
            <span className="truncate leading-tight font-semibold">Content Form</span>
          </div>

          {/* Trailing Chevron */}
          <ChevronRight size={16} className="absolute right-4 opacity-40 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* BUTTON 4: Call Back */}
        <button
          type="button"
          onClick={() => setActivePopup('callback')}
          aria-haspopup="dialog"
          aria-expanded={activePopup === 'callback'}
          style={customFontStyle}
          className={`relative group w-full min-h-[52px] px-4 flex items-center justify-center text-center font-semibold text-xs sm:text-sm uppercase tracking-wide transition-all duration-150 cursor-pointer select-none active:scale-[0.99] ${buttonClass}`}
        >
          {/* Centered Icon + Label Group */}
          <div className="flex items-center justify-center gap-2.5 max-w-[80%]">
            <span className="w-7 h-7 rounded-full bg-amber-500/15 text-amber-500 dark:bg-amber-500/25 dark:text-amber-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
              <PhoneCall size={15} className="shrink-0" />
            </span>
            <span className="truncate leading-tight font-semibold">Call Back</span>
          </div>

          {/* Trailing Chevron */}
          <ChevronRight size={16} className="absolute right-4 opacity-40 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* ── POPUP 1: Quick Links Modal ──────────────────────────────────────── */}
      <QuickActionPopup
        isOpen={activePopup === 'quick-links'}
        onClose={() => setActivePopup(null)}
        title="Quick Links"
        subtitle="Direct links & actions"
        preview={preview}
        contrastMode={contrastMode}
        font={font}
      >
        {activeLinks.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {activeLinks.map((link) => (
              <LinkButton
                key={link.id}
                link={link}
                buttonStyle={buttonStyle}
                font={font}
                username={username}
                preview={preview}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 space-y-1.5 opacity-75">
            <p className="text-xs font-semibold">No quick links added yet</p>
            <p className="text-[11px] opacity-60">Add your links in the Quick Action tab</p>
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
          <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/15 shadow-inner bg-slate-900/80 relative flex items-center justify-center">
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

          {/* Contact Details */}
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

          {/* Actions */}
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

      {/* ── POPUP 3: Customer Form Modal (Triggered by Content Form Quick Action) ── */}
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

      {/* ── POPUP 4: Call Back Modal ─────────────────────────────────────────── */}
      <QuickActionPopup
        isOpen={activePopup === 'callback'}
        onClose={() => {
          setActivePopup(null);
          setCallBackSubmitted(false);
          setCallBackError(null);
          setCallBackNameError(null);
          setCallBackPhoneError(null);
        }}
        title="Request a Call Back"
        subtitle="We will get back to you shortly"
        preview={preview}
        contrastMode={contrastMode}
        font={font}
      >
        {callBackSubmitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 size={26} />
            </div>
            <h4 className="text-sm font-bold">Call Back Requested!</h4>
            <p className="text-xs opacity-75 leading-relaxed">
              Thank you! Your request has been sent. We will call you back shortly.
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setActivePopup(null);
                setCallBackSubmitted(false);
                setCallBackNameError(null);
                setCallBackPhoneError(null);
              }}
              className="mt-2"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleCallBackSubmit} className="space-y-3.5 py-1">
            {callBackError && (
              <div className="p-2.5 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl">
                {callBackError}
              </div>
            )}

            <Input
              id="callback-name"
              label="Your Name *"
              placeholder="Enter your name"
              value={callBackName}
              onChange={(e) => {
                setCallBackName(e.target.value);
                if (callBackNameError) setCallBackNameError(null);
              }}
              error={callBackNameError}
              leadingIcon={User}
              required
              contrastMode={contrastMode}
            />

            <div className="space-y-1 text-left">
              <label className={`text-xs font-semibold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Phone Number *
              </label>
              <div className="flex gap-2">
                <select
                  value={callBackCountryCode}
                  onChange={(e) => setCallBackCountryCode(e.target.value)}
                  className={countrySelectClass}
                >
                  {COUNTRY_CODES.map((c) => (
                    <option
                      key={c.code + c.name}
                      value={c.code}
                      className={isLight ? 'bg-white text-slate-900' : 'bg-slate-800 text-white'}
                    >
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <div className="flex-1">
                  <Input
                    id="callback-phone"
                    type="tel"
                    placeholder="Mobile number"
                    value={callBackPhone}
                    onChange={(e) => {
                      setCallBackPhone(e.target.value);
                      if (callBackPhoneError) setCallBackPhoneError(null);
                    }}
                    error={callBackPhoneError}
                    leadingIcon={Phone}
                    required
                    contrastMode={contrastMode}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                loading={callBackLoading}
                className="shadow-btn hover:shadow-btn-hover text-xs font-bold py-2.5 flex items-center justify-center gap-1.5"
              >
                <PhoneCall size={14} />
                <span>Request a Call Back</span>
              </Button>
            </div>
          </form>
        )}
      </QuickActionPopup>
    </div>
  );
}
