'use client';

import { ExternalLink } from 'lucide-react';
import { getIconForUrl } from '@/components/profile/SocialIcons';

const buttonStyles = {
  rounded:
    'rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 shadow-soft hover:shadow-card hover:border-slate-300',
  filled:
    'rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-btn hover:shadow-btn-hover border border-slate-900',
  outline:
    'rounded-2xl bg-transparent border-2 border-slate-300 hover:border-slate-900 text-slate-800 hover:bg-slate-50 shadow-xs',
  shadow:
    'rounded-2xl bg-white hover:bg-slate-50 border border-slate-100 shadow-card hover:shadow-card-hover text-slate-800',
  glassmorphism:
    'rounded-2xl bg-white/70 hover:bg-white/90 backdrop-blur-md border border-white/60 text-slate-900 shadow-soft hover:shadow-card',
  hardshadow:
    'rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] text-slate-900',
};

/**
 * LinkButton applies the custom Theme Font specifically to the link button text.
 */
export default function LinkButton({
  link,
  buttonStyle = 'rounded',
  font,
  username,
  preview = false,
}) {
  const { Icon } = getIconForUrl(link.url);

  function handleClick(e) {
    if (preview) {
      e.preventDefault();
      return;
    }
  }

  const buttonClass = buttonStyles[buttonStyle] ?? buttonStyles.rounded;
  const isFilled = buttonStyle === 'filled';
  const customFontStyle = font ? { fontFamily: font } : {};

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
