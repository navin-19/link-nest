'use client';

import { resolveLinkIcon } from '@/components/links/resolveLinkIcon';
import { buttonStyles } from '@/components/links/buttonStyles';

/**
 * LinkButton applies the custom Theme Font and selected button style preset to the link item.
 * Features centered icon and label text, with no trailing chevron symbol.
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
          'group flex flex-col items-center justify-center text-center gap-2 w-full p-4 aspect-square',
          'font-semibold text-xs sm:text-sm',
          'transition-all duration-150 ease-out',
          'hover:scale-[1.02] active:scale-[0.98]',
          buttonClass,
          preview ? 'cursor-default select-none' : 'cursor-pointer',
        ].join(' ')}
      >
        {/* Centered Brand Icon */}
        <span className="flex items-center justify-center w-8 h-8 shrink-0 transition-transform group-hover:scale-110">
          <Icon size={28} className="shrink-0 drop-shadow-2xs" />
        </span>

        {/* Link Title */}
        <span className="w-full text-center line-clamp-2 leading-snug px-1">{link.title}</span>
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
