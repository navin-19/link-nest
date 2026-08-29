'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { resolveLinkIcon } from '@/components/links/resolveLinkIcon';
import { buttonStyles } from '@/components/links/buttonStyles';

export const QUICK_LINK_ACTIONS = {
  whatsapp:  { description: 'Chat with us on WhatsApp', actionLabel: 'Start Chat' },
  instagram: { description: 'Follow us on Instagram', actionLabel: 'Open Instagram' },
  phone:     { description: 'Speak directly with our team', actionLabel: 'Call Now' },
  email:     { description: 'Contact us by email', actionLabel: 'Send Email' },
  facebook:  { description: 'Visit our Facebook page', actionLabel: 'Open Facebook' },
  youtube:   { description: 'Watch our latest videos', actionLabel: 'Open YouTube' },
  website:   { description: 'Visit our official website', actionLabel: 'Visit Website' },
  twitter:   { description: 'Follow us on X', actionLabel: 'Open X' },
  linkedin:  { description: 'Connect with us on LinkedIn', actionLabel: 'Open LinkedIn' },
  telegram:  { description: 'Join our Telegram', actionLabel: 'Open Telegram' },
};

/**
 * QuickLinkCard: Expandable accordion card with strictly centered label (grid 40px 1fr 40px).
 * Tapping header toggles expand/collapse only; the action button inside navigates.
 */
export default function QuickLinkCard({
  link,
  isExpanded,
  onToggle,
  buttonStyle = 'rounded',
  font,
  preview = false,
  contrastMode = 'light',
}) {
  const { Icon } = resolveLinkIcon(link);
  const effectiveStyle = link?.custom_style?.buttonStyle ?? buttonStyle;
  const buttonClass = buttonStyles[effectiveStyle] ?? buttonStyles.rounded;
  const customFontStyle = font ? { fontFamily: font } : {};

  const actionConfig = QUICK_LINK_ACTIONS[link.key] || {
    description: `Explore our ${link.title}`,
    actionLabel: `Open ${link.title}`,
  };

  const isDirectAction = link.url?.startsWith('mailto:') || link.url?.startsWith('tel:');
  const target = preview || isDirectAction ? '_self' : '_blank';
  const href = preview ? '#' : (link.url || '#');

  const contentId = `quick-link-panel-${link.id}`;

  return (
    <div className="w-full flex flex-col space-y-1.5">
      {/* Accordion Header Button: Fixed 3-column CSS Grid ensures true center alignment */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        style={customFontStyle}
        className={[
          'grid grid-cols-[40px_1fr_40px] items-center w-full min-h-[52px] px-4 rounded-2xl',
          'font-semibold text-sm transition-all duration-200 cursor-pointer select-none text-left',
          'hover:scale-[1.01] active:scale-[0.99]',
          buttonClass,
        ].join(' ')}
      >
        {/* Left: Brand Icon */}
        <span className="flex items-center justify-center w-7 h-7 shrink-0 justify-self-start">
          <Icon size={22} className="drop-shadow-2xs" />
        </span>

        {/* Center: Truly Centered Label */}
        <span className="text-center font-semibold truncate px-2 leading-tight">
          {link.title}
        </span>

        {/* Right: Rotating Chevron */}
        <ChevronDown
          size={18}
          className={`justify-self-end transition-transform duration-300 opacity-70 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Accordion Expanded Body */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={contentId}
            role="region"
            aria-labelledby={link.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden w-full px-0.5"
          >
            <div
              className={`p-4 rounded-2xl border backdrop-blur-xs space-y-3 my-1 ${
                contrastMode === 'dark'
                  ? 'bg-slate-900/70 border-white/10 text-slate-200 shadow-soft'
                  : 'bg-white/80 border-slate-200/90 text-slate-700 shadow-soft'
              }`}
            >
              <p className="text-xs leading-relaxed font-medium">
                {actionConfig.description}
              </p>

              {/* Sole Action Navigation Button */}
              <a
                href={href}
                target={target}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (preview) e.preventDefault();
                }}
                className={`flex items-center justify-center w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-btn hover:opacity-95 active:scale-[0.98] cursor-pointer ${
                  contrastMode === 'dark'
                    ? 'bg-white text-slate-900 hover:bg-slate-100'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {actionConfig.actionLabel}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
