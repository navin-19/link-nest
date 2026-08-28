'use client';

import ProfileHeader from '@/components/profile/ProfileHeader';
import LinkList from '@/components/links/LinkList';
import SocialIcons from '@/components/profile/SocialIcons';
import ProductList from '@/components/products/ProductList';
import SubscribeBar from '@/components/profile/SubscribeBar';
import Link from 'next/link';
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
  const effectiveTheme = theme || profile?.themes;
  const effectiveUsername = username || profile?.username;

  // Background style resolution supporting object and string formats
  const bg = effectiveTheme?.background;
  let bgStyle = { backgroundColor: '#ffffff' };

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

  const content = (
    <div className="w-full flex flex-col justify-between min-h-full space-y-4">
      <div className="space-y-4 w-full">
        {/* Top Header / Subscribe Bar */}
        {preview ? (
          <div className="w-full flex items-center justify-between py-1 mb-1 shrink-0 opacity-90 select-none pointer-events-none">
            {/* Logo */}
            <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-bold text-[10px] tracking-tight bg-white/80 dark:bg-slate-900/80 px-2.5 py-1.5 rounded-full border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <div className="w-4 h-4 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900">
                <span className="text-[8px] font-bold">L</span>
              </div>
              <span>LinkNest</span>
            </div>

            {/* Subscribe Button */}
            <div className="px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold shadow-btn">
              Subscribe
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

        {/* Links List (Single consolidated source of truth) */}
        <LinkList
          links={links}
          buttonStyle={buttonStyle}
          font={font}
          username={effectiveUsername}
          preview={preview}
          contrastMode={contrastMode}
        />

        {/* Social Icons Bar (Unified dark-themed rounded square icon system) */}
        <SocialIcons
          profile={profile}
          preview={preview}
        />

        {/* Products & Services Section (Category filters + Products list) */}
        {profile?.show_products !== false && (
          <ProductList
            products={products}
            font={font}
            preview={preview}
            contrastMode={contrastMode}
          />
        )}
      </div>

      {/* Footer */}
      {preview ? (
        <div className="py-4 text-center">
          <span
            className={`text-[10px] tracking-widest uppercase font-bold px-3 py-1 rounded-full border shadow-xs backdrop-blur-xs transition-colors ${
              isDark
                ? 'text-white/70 bg-slate-900/70 border-slate-700/60'
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
                ? 'text-white/80 hover:text-white bg-slate-900/80 hover:bg-slate-900 border-slate-700/80'
                : 'text-slate-500 hover:text-slate-800 bg-white/80 hover:bg-white border-slate-200/80'
            }`}
          >
            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
              isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
            }`}>
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
      className={`min-h-screen flex flex-col justify-between py-10 px-4 selection:bg-slate-900 selection:text-white ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}
    >
      <div className="w-full max-w-md mx-auto">
        {content}
      </div>
    </main>
  );
}
