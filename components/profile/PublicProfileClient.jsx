'use client';

import { useState, useRef } from 'react';
import { MotionConfig, useScroll, useMotionValueEvent } from 'framer-motion';
import ProfileHeader from '@/components/profile/ProfileHeader';
import CompactHeaderBar from '@/components/profile/CompactHeaderBar';
import SocialIcons from '@/components/profile/SocialIcons';
import LinkList from '@/components/links/LinkList';
import ProductList from '@/components/products/ProductList';
import GoogleReviewsSection from '@/components/products/GoogleReviewsSection';
import SubscribeBar from '@/components/profile/SubscribeBar';
import Link from 'next/link';

export default function PublicProfileClient({ profile, links = [], products = [], username }) {
  const headerRef = useRef(null);
  const [showCompactHeader, setShowCompactHeader] = useState(false);

  // iOS-style collapsing header: track when the full profile header scrolls out of view
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ['start start', 'end start'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setShowCompactHeader(latest >= 0.95);
  });

  const theme = profile.themes;
  const bg = theme?.background;
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
      backgroundAttachment: 'fixed',
    };
  }

  const font = theme?.font || 'Inter';
  const buttonStyle = theme?.button_style || 'rounded';

  return (
    <MotionConfig reducedMotion="user">
      {/* 1. Sticky Collapsing Header Bar */}
      <CompactHeaderBar show={showCompactHeader} profile={profile} />

      <main
        style={bgStyle}
        className="min-h-screen text-slate-900 flex flex-col justify-between pt-10 pb-28 px-4 selection:bg-slate-900 selection:text-white"
      >
        <div className="w-full max-w-md mx-auto space-y-4">
          {/* Logo and Subscribe Controls */}
          <SubscribeBar username={username} />

          {/* Full Profile Header in normal document flow */}
          <div ref={headerRef}>
            <ProfileHeader profile={profile} />
          </div>

          {/* Dynamic Link List with Theme Font & Scroll Animations */}
          <LinkList
            links={links || []}
            buttonStyle={buttonStyle}
            font={font}
            username={username}
          />

          {/* Products & Services Showcase */}
          {products && products.length > 0 && (
            <ProductList
              products={products}
              buttonStyle={buttonStyle}
              font={font}
            />
          )}

          {/* Google Business Reviews */}
          {profile.show_google_reviews && profile.google_place_id && (
            <GoogleReviewsSection
              placeId={profile.google_place_id}
              font={font}
            />
          )}

          {/* Subtle LinkNest Brand Footer */}
          <footer className="w-full text-center pt-8 pb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-slate-200/90 text-xs text-slate-600 hover:text-slate-950 transition-all shadow-xs hover:shadow-soft"
            >
              <div className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[9px] font-bold">
                L
              </div>
              <span>
                Create your own <strong className="text-slate-900 font-semibold">LinkNest</strong>
              </span>
            </Link>
          </footer>
        </div>

        {/* 2. Static Bottom Social Icons Bar (Fixed to viewport bottom) */}
        <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-t border-slate-200/70 dark:border-slate-800/70 shadow-lg">
          <div className="w-full max-w-md flex items-center justify-center">
            <SocialIcons profile={profile} links={links || []} />
          </div>
        </div>
      </main>
    </MotionConfig>
  );
}
