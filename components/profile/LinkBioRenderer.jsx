'use client';

import { useState } from 'react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import SubscribeBar from '@/components/profile/SubscribeBar';
import QuickActionGroup from '@/components/profile/QuickActionGroup';
import SocialIcons from '@/components/profile/SocialIcons';
import ProductsStoreSection from '@/components/profile/ProductsStoreSection';
import GoogleReviewsSection from '@/components/profile/GoogleReviewsSection';
import LinkButton from '@/components/links/LinkButton';
import Heading from '@/components/ui/Heading';
import Link from 'next/link';
import { Link2 } from 'lucide-react';
import { getContrastMode } from '@/utils/getContrastMode';
import { resolveCustomerFormConfig } from '@/utils/customerFormConfig';

/**
 * LinkBioRenderer: The single shared source-of-truth component
 * for rendering the Link-in-Bio page across both LivePreview and the public [username] route.
 */
export default function LinkBioRenderer({
  profile,
  links = [],
  products = [],
  theme,
  preview = false,
  compact = false,
  username,
}) {
  const [activePopup, setActivePopup] = useState(null); // 'quick-links' | 'reach-us' | 'content-form' | null

  const effectiveTheme = theme || profile?.themes;
  const effectiveUsername = username || profile?.username;
  const formConfig = resolveCustomerFormConfig(profile?.customer_form_config);

  // Background style resolution supporting object and string formats
  const bg = effectiveTheme?.background;
  let bgStyle = { backgroundColor: '#09090b' };

  if (bg?.type === 'solid') {
    bgStyle = { backgroundColor: bg.value };
  } else if (bg?.type === 'gradient') {
    bgStyle = { background: bg.value };
  } else if (bg?.type === 'image') {
    bgStyle = {
      backgroundImage: `url(${bg.value})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'scroll',
    };
  } else if (typeof bg === 'string') {
    if (bg.startsWith('linear-gradient') || bg.startsWith('radial-gradient')) {
      bgStyle = { background: bg };
    } else if (bg.startsWith('http') || bg.startsWith('/')) {
      bgStyle = {
        backgroundImage: `url(${bg})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
      };
    } else {
      bgStyle = { backgroundColor: bg };
    }
  }

  // Calculate contrast mode based on background
  const contrastMode = getContrastMode(bg || effectiveTheme?.background);
  const isDark = contrastMode === 'dark';

  const font = effectiveTheme?.font || 'Inter';
  const buttonStyle = effectiveTheme?.button_style || 'rounded';
  const textColor = effectiveTheme?.text_color || (isDark ? '#ffffff' : '#0f172a');

  const content = (
    <div
      style={{ fontFamily: font, color: textColor, '--theme-font': font }}
      className="w-full flex flex-col justify-between min-h-full space-y-4 relative"
    >
      <div className="space-y-4 w-full">
        {/* Top Header / Subscribe Bar */}
        {preview ? (
          <div className="w-full flex items-center justify-between py-1 mb-1 shrink-0 opacity-95 select-none pointer-events-none">
            {/* Logo */}
            <div className={`flex items-center gap-1.5 font-bold text-[10px] tracking-tight px-2.5 py-1.5 rounded-full border shadow-2xs backdrop-blur-md ${
              isDark ? 'text-white/90 bg-[#111322]/80 border-white/15' : 'text-slate-800 bg-white/80 border-slate-200/90'
            }`}>
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-[8px]">
                <Link2 size={9} strokeWidth={3} />
              </div>
              <span>LinkNest</span>
            </div>

            {/* Overflow Menu Mock */}
            <div className="flex items-center gap-1.5">
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                isDark ? 'bg-[#111322]/80 border-white/15 text-white/80' : 'bg-white/80 border-slate-200/90 text-slate-700'
              }`}>
                <span className="text-[10px] font-bold leading-none">⋮</span>
              </div>
            </div>
          </div>
        ) : (
          <SubscribeBar
            username={effectiveUsername}
            profile={profile}
            contrastMode={contrastMode}
          />
        )}

        {/* Profile Header (Avatar, Display Name, Bio, Verified Badge) */}
        <ProfileHeader
          profile={profile}
          compact={compact}
          contrastMode={contrastMode}
          theme={effectiveTheme}
          font={font}
        />

        {/* ── 1. QUICK ACTION (3 Buttons: Quick Links, Reach Us, Content Form) ── */}
        <QuickActionGroup
          profile={profile}
          formConfig={formConfig}
          links={links}
          products={products}
          buttonStyle={buttonStyle}
          font={font}
          username={effectiveUsername}
          preview={preview}
          contrastMode={contrastMode}
          activePopup={activePopup}
          setActivePopup={setActivePopup}
        />

        {/* ── 2. CUSTOM PROFILE LINKS (Custom added buttons) ──────────────────── */}
        {links && links.filter((l) => l.is_active !== false).length > 0 && (
          <div className="w-full flex flex-col gap-2.5 pt-1">
            {links
              .filter((l) => l.is_active !== false)
              .map((link) => (
                <LinkButton
                  key={link.id}
                  link={link}
                  buttonStyle={buttonStyle}
                  font={font}
                  username={effectiveUsername}
                  preview={preview}
                />
              ))}
          </div>
        )}

        {/* ── 3. WHAT OUR CUSTOMERS SAY (Google Reviews Section) ─────────────── */}
        {profile?.show_google_reviews !== false &&
          Boolean(
            profile?.google_place_id ||
              profile?.google_maps_url ||
              profile?.reach_out?.google_place_id ||
              profile?.reach_out?.mapsUrl
          ) && (
            <div className="w-full pt-1">
              <GoogleReviewsSection
                profile={profile}
                placeId={profile?.google_place_id || profile?.reach_out?.google_place_id}
                mapsUrl={profile?.google_maps_url || profile?.reach_out?.mapsUrl}
                preview={preview}
                contrastMode={contrastMode}
                font={font}
                buttonStyle={buttonStyle}
              />
            </div>
          )}

        {/* ── 4. FOLLOW US (Plain Centered Heading + Bare Monochrome Icon Row) ─ */}
        <div className="w-full flex flex-col pt-1">
          <h3
            className={`text-center text-sm font-bold uppercase tracking-wide my-6 select-none ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            FOLLOW US
          </h3>
          <SocialIcons
            profile={profile}
            socialLinks={profile?.social_links}
            preview={preview}
            contrastMode={contrastMode}
          />
        </div>

        {/* ── 5. PRODUCTS & SERVICES (Independent Section below Follow Us) ────── */}
        <ProductsStoreSection
          products={products}
          profile={profile}
          buttonStyle={buttonStyle}
          font={font}
          preview={preview}
          contrastMode={contrastMode}
        />
      </div>

      {/* ── 6. Bottom CTA (Plain centered text, no button chrome) ─────────────── */}
      {preview ? (
        <div className="py-6 text-center" style={{ fontFamily: font }}>
          <p
            className={`text-center text-xs font-bold tracking-wide uppercase select-none ${
              isDark ? 'text-slate-400' : 'text-slate-800'
            }`}
          >
            CREATE YOUR LINKNEST
          </p>
        </div>
      ) : (
        <div className="py-6 text-center" style={{ fontFamily: font }}>
          <Link
            href="/"
            className={`inline-block text-center text-xs font-bold tracking-wide uppercase transition-opacity hover:opacity-75 ${
              isDark ? 'text-slate-300 hover:text-white' : 'text-slate-800 hover:text-slate-950'
            }`}
          >
            CREATE YOUR LINKNEST
          </Link>
        </div>
      )}
    </div>
  );

  if (preview) {
    return content;
  }

  // Full page wrapper for public profile view
  return (
    <main
      style={{ ...bgStyle, fontFamily: font, '--theme-font': font }}
      className={`min-h-screen flex flex-col justify-between py-8 px-4 selection:bg-orange-500 selection:text-white ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}
    >
      <div className="w-full max-w-md mx-auto">
        {content}
      </div>
    </main>
  );
}
