'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileHeader from '@/components/profile/ProfileHeader';
import LinkButton from '@/components/links/LinkButton';
import SocialIcons from '@/components/profile/SocialIcons';
import ProductList from '@/components/products/ProductList';
import GoogleReviewsSection from '@/components/products/GoogleReviewsSection';
import { Smartphone } from 'lucide-react';

/**
 * Live phone-mockup preview with smooth auto-scroll & animated link cards.
 */
export default function LivePreview({ profile, links = [], products = [], theme }) {
  const scrollContainerRef = useRef(null);
  const prevLinksCount = useRef(links.length);
  const activeLinks = links.filter((l) => l.is_active);

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
    };
  }

  const font = theme?.font || 'Inter';
  const buttonStyle = theme?.button_style || 'rounded';

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Header pill */}
      <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-500">
        <Smartphone size={14} />
        <span>Live Device Preview</span>
      </div>

      {/* Phone Mockup Frame */}
      <div className="relative w-[310px] h-[620px] rounded-[48px] border-[10px] border-slate-900 bg-slate-900 p-2.5 shadow-2xl ring-1 ring-slate-200">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20" />

        {/* Screen Container with smooth scrollable overflow */}
        <div
          ref={scrollContainerRef}
          style={bgStyle}
          className="w-full h-full rounded-[36px] overflow-y-auto overflow-x-hidden p-4 pt-8 flex flex-col justify-between scroll-smooth scrollbar-none transition-all duration-300 shadow-inner"
        >
          <div className="space-y-4">
            {/* WYSIWYG Logo and Subscribe Bar (Preview only) */}
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

            {/* Profile Header (Title Font stays independent) */}
            <ProfileHeader profile={profile} compact />

            {/* Links (Link cards use custom Theme Font & fluid animation) */}
            <div>
              {activeLinks.length === 0 && products.length === 0 ? (
                <div className="text-center py-5 px-3 rounded-2xl border-2 border-dashed border-slate-300/80 bg-white/60 backdrop-blur-xs text-slate-600 shadow-2xs space-y-1 my-1">
                  <p className="text-xs font-semibold text-slate-800">Your links will appear here</p>
                  <p className="text-[10px] text-slate-500">Add your first link to get started</p>
                </div>
              ) : buttonStyle === 'bentogrid' ? (
                <div className="grid grid-cols-2 gap-2.5 w-full">
                  <AnimatePresence mode="popLayout">
                    {activeLinks.map((link) => (
                      <motion.div
                        key={link.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                      >
                        <LinkButton
                          link={link}
                          buttonStyle={buttonStyle}
                          font={font}
                          username={profile?.username}
                          preview={true}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <AnimatePresence mode="popLayout">
                    {activeLinks.map((link) => (
                      <motion.div
                        key={link.id}
                        layout
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                      >
                        <LinkButton
                          link={link}
                          buttonStyle={buttonStyle}
                          font={font}
                          username={profile?.username}
                          preview={true}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Social Icons Bar (rendered below link cards) */}
            <SocialIcons profile={profile} links={links} size={14} preview={true} />

            {/* Product Showcase (Separate visually from links) */}
            {products.length > 0 && (
              <ProductList
                products={products}
                buttonStyle={buttonStyle}
                font={font}
                preview={true}
              />
            )}

            {/* Google Reviews Section */}
            {profile?.show_google_reviews && profile?.google_place_id && (
              <GoogleReviewsSection
                placeId={profile.google_place_id}
                font={font}
              />
            )}
          </div>

          {/* Footer Logo */}
          <div className="py-4 text-center">
            <span className="text-[10px] tracking-widest uppercase font-bold text-slate-500 bg-white/70 px-3 py-1 rounded-full border border-slate-200/60 shadow-xs backdrop-blur-xs">
              LinkNest
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
