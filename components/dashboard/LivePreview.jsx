'use client';

import { useRef, useEffect } from 'react';
import LinkBioRenderer from '@/components/profile/LinkBioRenderer';
import { Smartphone } from 'lucide-react';

/**
 * Live phone-mockup preview with smooth auto-scroll, using the shared LinkBioRenderer.
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
    <div className={`flex flex-col items-center justify-center ${showHeader ? 'p-4' : 'p-0'} ${className}`}>
      {/* Header pill */}
      {showHeader && (
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-500">
          <Smartphone size={14} />
          <span>Live Device Preview</span>
        </div>
      )}

      {/* Phone Mockup Frame */}
      <div className="relative w-[300px] sm:w-[310px] h-[600px] sm:h-[620px] rounded-[48px] border-[10px] border-slate-900 bg-slate-900 p-2.5 shadow-2xl ring-1 ring-slate-200">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20" />

        {/* Screen Container with smooth scrollable overflow */}
        <div
          ref={scrollContainerRef}
          style={bgStyle}
          className="w-full h-full rounded-[36px] overflow-y-auto overflow-x-hidden p-4 pt-8 scroll-smooth scrollbar-none transition-all duration-300 shadow-inner"
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
      </div>
    </div>
  );
}
