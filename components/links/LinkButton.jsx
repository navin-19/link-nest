'use client';

import { ChevronRight } from 'lucide-react';
import { resolveLinkIcon } from '@/components/links/resolveLinkIcon';
import { buttonStyles } from '@/components/links/buttonStyles';

/**
 * LinkButton applies the custom Theme Font and selected button style preset to the link item.
 * For bentogrid preset: Renders full-width stacked card with centered icon-in-soft-circle + label and trailing chevron.
 */
export default function LinkButton({
  link,
  buttonStyle = 'rounded',
  font,
  username,
  preview = false,
}) {
  const { Icon } = resolveLinkIcon(link);

  function handleClick(e) {
    if (preview) {
      e.preventDefault();
      return;
    }
  }

  const effectiveStyle = link?.custom_style?.buttonStyle ?? buttonStyle;
  const buttonClass = buttonStyles[effectiveStyle] ?? buttonStyles.rounded;
  const isBento = effectiveStyle === 'bentogrid';
  const customFontStyle = font ? { fontFamily: font } : {};

  const href = preview ? '#' : (link.url || `/api/track/${link.id}`);
  const isDirectAction = link.url?.startsWith('mailto:') || link.url?.startsWith('tel:');
  const target = preview || isDirectAction ? '_self' : '_blank';

  if (isBento) {
    return (
      <a
        href={href}
        target={target}
        rel="noopener noreferrer"
        onClick={handleClick}
        style={customFontStyle}
        className={[
          'relative group flex items-center justify-center w-full px-4 py-3.5 min-h-[52px] rounded-2xl',
          'font-semibold text-xs sm:text-sm uppercase tracking-wide',
          'transition-all duration-150 ease-out',
          'hover:scale-[1.01] active:scale-[0.98]',
          buttonClass,
          preview ? 'cursor-default select-none' : 'cursor-pointer',
        ].join(' ')}
      >
        {/* Centered Icon + Label Group */}
        <div className="flex items-center justify-center gap-2.5 max-w-[80%]">
          <span className="w-7 h-7 rounded-full bg-blue-500/15 text-blue-500 dark:bg-blue-500/25 dark:text-blue-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
            <Icon size={15} className="shrink-0 drop-shadow-2xs" />
          </span>
          <span className="truncate leading-tight font-semibold">{link.title}</span>
        </div>

        {/* Trailing Chevron */}
        <ChevronRight size={16} className="absolute right-4 opacity-40 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </a>
    );
  }

  return (
    <a
      href={href}
      target={target}
      rel="noopener noreferrer"
      onClick={handleClick}
      style={customFontStyle}
      className={[
        'group flex items-center justify-center gap-3 w-full px-4 py-3 sm:px-5 sm:py-3.5',
        'font-semibold text-sm text-center',
        'transition-all duration-150 ease-out',
        'hover:scale-[1.01] active:scale-[0.98]',
        buttonClass,
        preview ? 'cursor-default select-none' : 'cursor-pointer',
      ].join(' ')}
    >
      {/* Centered Brand Icon */}
      <span className="flex items-center justify-center w-6 h-6 shrink-0 transition-transform group-hover:scale-110">
        <Icon size={22} className="shrink-0 drop-shadow-2xs" />
      </span>

      {/* Centered Title */}
      <span className="font-semibold text-sm truncate">{link.title}</span>
    </a>
  );
}
