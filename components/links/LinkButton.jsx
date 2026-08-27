'use client';

import { ExternalLink } from 'lucide-react';
import { resolveLinkIcon } from '@/components/links/resolveLinkIcon';
import { buttonStyles } from '@/components/links/buttonStyles';

/**
 * LinkButton applies the custom Theme Font and selected button style preset to the link item.
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

  const buttonClass = buttonStyles[buttonStyle] ?? buttonStyles.rounded;
  const isFilled = buttonStyle === 'filled';
  const isBento = buttonStyle === 'bentogrid';
  const customFontStyle = font ? { fontFamily: font } : {};

  if (isBento) {
    return (
      <a
        href={preview ? '#' : `/api/track/${link.id}`}
        target={preview ? '_self' : '_blank'}
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
      href={preview ? '#' : `/api/track/${link.id}`}
      target={preview ? '_self' : '_blank'}
      rel="noopener noreferrer"
      onClick={handleClick}
      style={customFontStyle}
      className={[
        'group flex items-center gap-2.5 w-full px-5 py-2.5',
        'font-semibold text-sm',
        'transition-all duration-150 ease-out',
        'hover:scale-[1.01] active:scale-[0.98]',
        buttonClass,
        preview ? 'cursor-default select-none' : 'cursor-pointer',
      ].join(' ')}
    >
      {/* Icon */}
      <span className="flex items-center justify-center w-7 h-7 shrink-0 transition-transform group-hover:scale-105 self-end">
        <Icon size={28} className="shrink-0 drop-shadow-2xs" />
      </span>

      {/* Title */}
      <span className="flex-1 text-center truncate">{link.title}</span>

      {/* External link indicator */}
      {!preview && (
        <ExternalLink
          size={14}
          className={`${
            isFilled ? 'text-white/50 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-600'
          } transition-colors shrink-0`}
        />
      )}
    </a>
  );
}
