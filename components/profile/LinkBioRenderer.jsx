'use client';

import { useState } from 'react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import GoogleReviewsSummary from '@/components/profile/GoogleReviewsSummary';
import LinkList from '@/components/links/LinkList';
import ReachUsSection from '@/components/profile/ReachUsSection';
import ProductsStoreSection from '@/components/profile/ProductsStoreSection';
import SocialIcons from '@/components/profile/SocialIcons';
import SubscribeBar from '@/components/profile/SubscribeBar';
import Link from 'next/link';
import { Crown } from 'lucide-react';
import { getContrastMode } from '@/utils/getContrastMode';

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
  // All accordion sections start COLLAPSED by default on page load
  const [expandedSection, setExpandedSection] = useState(null); // 'quick-links' | 'reach-us' | 'products' | null

  const toggleSection = (sectionId) => {
    setExpandedSection((prev) => (prev === sectionId ? null : sectionId));
  };

  const effectiveTheme = theme || profile?.themes;
  const effectiveUsername = username || profile?.username;

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
      style={{ fontFamily: font, color: textColor }}
      className="w-full flex flex-col justify-between min-h-full space-y-4"
    >
      <div className="space-y-4 w-full">
        {/* Top Header / Subscribe Bar */}
        {preview ? (
          <div className="w-full flex items-center justify-between py-1 mb-1 shrink-0 opacity-95 select-none pointer-events-none">
            {/* Logo */}
            <div className="flex items-center gap-1.5 text-white/90 font-bold text-[10px] tracking-tight bg-[#111322]/80 px-2.5 py-1.5 rounded-full border border-white/15 shadow-xs">
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-[8px]">
                L
              </div>
              <span>LinkNest</span>
            </div>

            {/* Subscribe Button + Overflow Menu */}
            <div className="flex items-center gap-1.5">
              <div className="px-3 py-1 rounded-full bg-white text-slate-950 text-[10px] font-bold shadow-md flex items-center gap-1">
                <Crown size={10} className="text-amber-500 fill-amber-500" />
                <span>Subscribe</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#111322]/80 border border-white/15 flex items-center justify-center text-white/80">
                <span className="text-[10px] font-bold leading-none">⋮</span>
              </div>
            </div>
          </div>
        ) : (
          <SubscribeBar username={effectiveUsername} profile={profile} />
        )}

        {/* Profile Header */}
        <ProfileHeader
          profile={profile}
          compact={compact}
          contrastMode={contrastMode}
          theme={effectiveTheme}
        />

        {/* Compact Google Reviews Summary (Respects show_google_reviews toggle and navigates to Google Reviews) */}
        {profile?.show_google_reviews !== false && (profile?.google_place_id || (preview && profile?.google_place_id)) && (
          <GoogleReviewsSummary
            placeId={profile?.google_place_id}
            mapsUrl={profile?.google_maps_url || profile?.reach_out?.mapsUrl}
            preview={preview}
          />
        )}

        {/* Quick Links Section (Social Links expandable accordion cards - Collapsed by default) */}
        <LinkList
          profile={profile}
          socialLinks={profile?.social_links}
          links={links}
          isExpanded={expandedSection === 'quick-links'}
          onToggle={() => toggleSection('quick-links')}
          buttonStyle={buttonStyle}
          font={font}
          username={effectiveUsername}
          preview={preview}
          contrastMode={contrastMode}
        />

        {/* Reach Us Section (Collapsed by default) */}
        <ReachUsSection
          profile={profile}
          reachOut={profile?.reach_out}
          isExpanded={expandedSection === 'reach-us'}
          onToggle={() => toggleSection('reach-us')}
          buttonStyle={buttonStyle}
          font={font}
          preview={preview}
          contrastMode={contrastMode}
        />

        {/* Products & Services Section (Collapsed by default) */}
        <ProductsStoreSection
          products={products}
          profile={profile}
          isExpanded={expandedSection === 'products'}
          onToggle={() => toggleSection('products')}
          buttonStyle={buttonStyle}
          font={font}
          preview={preview}
          contrastMode={contrastMode}
        />

        {/* Social Icons Row at bottom */}
        <SocialIcons
          profile={profile}
          socialLinks={profile?.social_links}
          preview={preview}
        />
      </div>

      {/* Footer */}
      {preview ? (
        <div className="py-3 text-center">
          <span
            className={`text-[9px] tracking-widest uppercase font-bold px-3 py-1 rounded-full border shadow-xs backdrop-blur-xs transition-colors ${
              isDark
                ? 'text-white/70 bg-[#111322]/80 border-white/10'
                : 'text-slate-500 bg-white/70 border-slate-200/60'
            }`}
          >
            LinkNest
          </span>
        </div>
      ) : (
        <div className="py-6 text-center">
          <Link
            href="/"
            className={`inline-flex items-center gap-1.5 text-[11px] tracking-wider uppercase font-bold px-4 py-1.5 rounded-full border shadow-xs hover:shadow-soft transition-all backdrop-blur-xs ${
              isDark
                ? 'text-white/80 hover:text-white bg-[#111322]/80 hover:bg-[#181c33] border-white/15'
                : 'text-slate-500 hover:text-slate-800 bg-white/80 hover:bg-white border-slate-200/80'
            }`}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white text-[8px] font-bold">
              L
            </div>
            <span>Create your LinkNest</span>
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
      style={bgStyle}
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
