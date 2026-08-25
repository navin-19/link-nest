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
};

/**
 * LinkButton with clean light theme variants and tactile drop shadow effects.
 */
export default function LinkButton({ link, buttonStyle = 'rounded', username, preview = false }) {
  const { Icon } = getIconForUrl(link.url);

  function handleClick(e) {
    if (preview) {
      e.preventDefault();
      return;
    }

    fetch('/api/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkId: link.id, referrer: document.referrer }),
    }).catch(() => {});
  }

  const buttonClass = buttonStyles[buttonStyle] ?? buttonStyles.rounded;
  const isFilled = buttonStyle === 'filled';

  return (
    <a
      href={preview ? '#' : link.url}
      target={preview ? '_self' : '_blank'}
      rel="noopener noreferrer"
      onClick={handleClick}
      className={[
        'group flex items-center gap-3 w-full px-5 py-3.5',
        'font-semibold text-sm',
        'transition-all duration-150 ease-out',
        'hover:scale-[1.01] active:scale-[0.98]',
        buttonClass,
        preview ? 'cursor-default select-none' : 'cursor-pointer',
      ].join(' ')}
    >
      {/* Icon */}
      <span className={`flex items-center justify-center w-8 h-8 rounded-xl shrink-0 ${isFilled ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-700'}`}>
        <Icon size={16} />
      </span>

      {/* Title */}
      <span className="flex-1 text-center truncate">{link.title}</span>

      {/* External link indicator */}
      {!preview && (
        <ExternalLink
          size={14}
          className={`${isFilled ? 'text-white/50 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-600'} transition-colors shrink-0`}
        />
      )}
    </a>
  );
}
