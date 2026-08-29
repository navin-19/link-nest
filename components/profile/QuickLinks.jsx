'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import LinkButton from '@/components/links/LinkButton';
import { getSocialLinksList } from '@/components/links/socialLinksHelper';
import { buttonStyles } from '@/components/links/buttonStyles';

/**
 * QuickLinks: Full-width expandable accordion card ("QUICK LINKS").
 * Starts COLLAPSED by default on public profile load.
 * Reflects the selected Card Design (buttonStyle) across all card elements.
 */
export default function QuickLinks({
  socialLinks = {},
  profile,
  isExpanded = false,
  onToggle,
  buttonStyle = 'rounded',
  font,
  username,
  preview = false,
  contrastMode = 'dark',
}) {
  const effectiveSocialLinks =
    socialLinks && Object.keys(socialLinks).length > 0
      ? socialLinks
      : profile?.social_links || {};

  const activeLinks = getSocialLinksList(effectiveSocialLinks);

  if (activeLinks.length === 0) {
    if (preview) {
      return (
        <div
          className={`text-center py-5 px-3 rounded-2xl border-2 border-dashed shadow-2xs space-y-1 my-1 w-full backdrop-blur-xs transition-colors ${
            contrastMode === 'dark'
              ? 'border-white/15 bg-black/40 text-slate-300'
              : 'border-slate-300/80 bg-white/60 text-slate-600'
          }`}
        >
          <p className="text-xs font-semibold">
            Your social links will appear here
          </p>
          <p className="text-[10px] text-slate-400">
            Add links in the Social Links tab
          </p>
        </div>
      );
    }
    return null;
  }

  const customFontStyle = font ? { fontFamily: font } : {};
  const buttonClass = buttonStyles[buttonStyle] ?? buttonStyles.rounded;

  return (
    <section style={customFontStyle} className="w-full flex flex-col space-y-2">
      {/* Top-level Expandable QUICK LINKS Card Header (Dynamically uses selected Card Design) */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls="quick-links-panel"
        style={customFontStyle}
        className={`grid grid-cols-[24px_1fr_24px] items-center w-full min-h-[52px] px-4 font-bold transition-all duration-200 cursor-pointer select-none text-left active:scale-[0.99] ${buttonClass}`}
      >
        {/* Left spacer for perfect centering */}
        <span className="w-6" aria-hidden="true" />

        {/* Center: QUICK LINKS Label */}
        <span className="text-center font-bold text-xs sm:text-sm uppercase tracking-wider truncate px-2">
          QUICK LINKS
        </span>

        {/* Right: Rotating Chevron */}
        <ChevronDown
          size={18}
          className={`justify-self-end opacity-75 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Expanded List of Direct Link Cards inside QUICK LINKS */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id="quick-links-panel"
            role="region"
            aria-label="Quick Links List"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden w-full flex flex-col gap-2 pt-1"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
