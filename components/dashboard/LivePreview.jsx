'use client';

import { useRef, useEffect } from 'react';
import LinkBioRenderer from '@/components/profile/LinkBioRenderer';

/**
 * Live phone-mockup preview with realistic bezel, notch, and smooth auto-scroll.
 */
export default function LivePreview({
  profile,
  links = [],
  products = [],
  theme,
  showHeader = true,
  className = '',
}) {
  const scrollContainerRef = useRef(null);
  const prevLinksCount = useRef(links.length);

  // Auto-scroll when links are added
  useEffect(() => {
    if (links.length > prevLinksCount.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
    prevLinksCount.current = links.length;
  }, [links.length]);

  const effectiveTheme = theme || profile?.themes;
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

  return (
    <div className={`flex flex-col items-center justify-center ${showHeader ? 'p-2 sm:p-4' : 'p-0'} ${className}`}>
      {/* Header with pulsing green dot */}
      {showHeader && (
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Live Device Preview</span>
        </div>
      )}

      {/* Realistic Phone Mockup Frame */}
      <div className="relative w-[295px] sm:w-[315px] h-[590px] sm:h-[620px] rounded-[48px] border-[10px] border-slate-900 bg-slate-900 p-2 shadow-2xl ring-1 ring-slate-800/40">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-30 shadow-inner flex items-center justify-end px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#111] ring-1 ring-slate-800/50" />
        </div>

        {/* Screen Container with smooth scrollable overflow */}
        <div
          ref={scrollContainerRef}
          style={bgStyle}
          className="relative w-full h-full rounded-[38px] overflow-y-auto overflow-x-hidden p-3.5 pt-7 pb-6 scroll-smooth scrollbar-none transition-all duration-300 shadow-inner"
        >
          <LinkBioRenderer
            profile={profile}
            links={links}
            products={products}
            theme={effectiveTheme}
            preview={true}
            compact={true}
            username={profile?.username}
          />
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/40 rounded-full z-30 pointer-events-none" />
      </div>
    </div>
  );
}
