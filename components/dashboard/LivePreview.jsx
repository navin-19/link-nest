'use client';

import ProfileHeader from '@/components/profile/ProfileHeader';
import LinkButton from '@/components/links/LinkButton';
import SocialIcons from '@/components/profile/SocialIcons';
import ProductList from '@/components/products/ProductList';
import GoogleReviewsSection from '@/components/products/GoogleReviewsSection';
import { Smartphone } from 'lucide-react';

/**
 * Live phone-mockup preview.
 */
export default function LivePreview({ profile, links = [], products = [], theme }) {
  const activeLinks = links.filter((l) => l.is_active);

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

        {/* Screen Container */}
        <div
          style={bgStyle}
          className="w-full h-full rounded-[36px] overflow-y-auto overflow-x-hidden p-4 pt-8 flex flex-col justify-between scrollbar-none transition-all duration-300 shadow-inner"
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

            {/* Social Icons Bar */}
            <SocialIcons links={links} size={14} preview={true} />

            {/* Links (Link cards use custom Theme Font) */}
            <div className="space-y-2.5 pt-2">
              {activeLinks.length === 0 && products.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 font-medium">
                  No active links or products
                </div>
              ) : (
                activeLinks.map((link) => (
                  <LinkButton
                    key={link.id}
                    link={link}
                    buttonStyle={buttonStyle}
                    font={font}
                    username={profile?.username}
                    preview={true}
                  />
                ))
              )}
            </div>

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
