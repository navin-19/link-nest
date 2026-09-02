'use client';

import React from 'react';
import { resolveLinkIcon } from '@/components/links/resolveLinkIcon';

// Official platform vector paths
function FacebookLogo({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramLogo({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function YouTubeLogo({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function TwitterXLogo({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInLogo({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function TikTokLogo({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.37 0 .73.08 1.05.22v-3.52a6.34 6.34 0 0 0-1.05-.09A6.34 6.34 0 0 0 3.15 15.67a6.34 6.34 0 0 0 6.34 6.33 6.34 6.34 0 0 0 6.34-6.33V9.12a8.16 8.16 0 0 0 4.76 1.52v-3.45a4.85 4.85 0 0 1-1-.5z" />
    </svg>
  );
}

function GitHubLogo({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function TwitchLogo({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M2.149 0l-1.612 4.119v16.836h5.731v3.045h3.224l3.045-3.045h4.657l6.27-6.269v-14.686h-21.315zm19.164 13.612l-3.582 3.582h-5.015l-3.045 3.045v-3.045h-4.299v-15.045h15.941v11.463zm-4.299-6.448h-2.149v6.09h2.149v-6.09zm-5.731 0h-2.149v6.09h2.149v-6.09z" />
    </svg>
  );
}

function TelegramLogo({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  );
}

function WebsiteLogo({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

const PLATFORM_MAP = {
  instagram: {
    Icon: InstagramLogo,
    label: 'Instagram',
    format: (v) => (v.startsWith('http') ? v : `https://instagram.com/${v.replace(/^@/, '')}`),
  },
  youtube: {
    Icon: YouTubeLogo,
    label: 'YouTube',
    format: (v) => (v.startsWith('http') ? v : `https://youtube.com/${v.startsWith('@') ? v : '@' + v}`),
  },
  tiktok: {
    Icon: TikTokLogo,
    label: 'TikTok',
    format: (v) => (v.startsWith('http') ? v : `https://tiktok.com/@${v.replace(/^@/, '')}`),
  },
  twitter: {
    Icon: TwitterXLogo,
    label: 'Twitter / X',
    format: (v) => (v.startsWith('http') ? v : `https://x.com/${v.replace(/^@/, '')}`),
  },
  x: {
    Icon: TwitterXLogo,
    label: 'Twitter / X',
    format: (v) => (v.startsWith('http') ? v : `https://x.com/${v.replace(/^@/, '')}`),
  },
  facebook: {
    Icon: FacebookLogo,
    label: 'Facebook',
    format: (v) => (v.startsWith('http') ? v : `https://facebook.com/${v}`),
  },
  linkedin: {
    Icon: LinkedInLogo,
    label: 'LinkedIn',
    format: (v) => (v.startsWith('http') ? v : (v.includes('/') ? `https://linkedin.com/${v}` : `https://linkedin.com/in/${v}`)),
  },
  github: {
    Icon: GitHubLogo,
    label: 'GitHub',
    format: (v) => (v.startsWith('http') ? v : `https://github.com/${v.replace(/^@/, '')}`),
  },
  twitch: {
    Icon: TwitchLogo,
    label: 'Twitch',
    format: (v) => (v.startsWith('http') ? v : `https://twitch.tv/${v.replace(/^@/, '')}`),
  },
  telegram: {
    Icon: TelegramLogo,
    label: 'Telegram',
    format: (v) => (v.startsWith('http') ? v : `https://t.me/${v.replace(/^@/, '')}`),
  },
  website: {
    Icon: WebsiteLogo,
    label: 'Website',
    format: (v) => (v.startsWith('http') ? v : `https://${v}`),
  },
};

/**
 * Shared SocialIcon Button Component:
 * Circular button with subtle border, soft shadow, and hover scale.
 */
export function SocialIconItem({ item, preview = false, onTrack, contrastMode = 'dark' }) {
  const Icon = item.Icon;
  const isLight = contrastMode === 'light';

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={item.label}
      title={item.label}
      onClick={() => onTrack && onTrack(item.id)}
      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border shadow-soft flex items-center justify-center shrink-0 transition-all duration-150 ease-out hover:scale-110 active:scale-95 cursor-pointer select-none ${
        isLight
          ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 hover:border-slate-300 hover:shadow-card'
          : 'bg-[#111322]/80 hover:bg-[#181c33] text-white border-white/15 hover:border-white/25 hover:shadow-card'
      }`}
    >
      <Icon size={18} className={`shrink-0 ${isLight ? 'text-slate-800' : 'text-white'}`} />
    </a>
  );
}

/**
 * SocialIcons Section - Pure Social Media Channels only
 */
export default function SocialIcons({
  profile,
  socialLinks: customSocialLinks,
  preview = false,
  contrastMode = 'dark',
}) {
  const profileSocial = customSocialLinks || profile?.social_links;
  if (!profileSocial || typeof profileSocial !== 'object') return null;

  const items = Object.entries(profileSocial)
    .filter(([_, val]) => typeof val === 'string' && val.trim().length > 0)
    .map(([platform, rawVal]) => {
      const val = rawVal.trim();
      const platformKey = platform.toLowerCase();

      // Only allow social platforms (exclude phone, email, whatsapp)
      if (platformKey === 'phone' || platformKey === 'email' || platformKey === 'call' || platformKey === 'whatsapp') {
        return null;
      }

      let config = PLATFORM_MAP[platformKey];
      let url = config ? config.format(val) : (val.startsWith('http') ? val : `https://${val}`);

      let Icon = config?.Icon;
      let label = config?.label || platform;

      if (!Icon || platformKey === 'website' || platformKey === 'url') {
        const resolved = resolveLinkIcon(val);
        Icon = resolved.Icon;
        label = resolved.label;
      }

      return {
        id: platformKey,
        url,
        Icon,
        label,
      };
    })
    .filter((item) => Boolean(item && item.Icon));

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Social media links"
      className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap py-1.5 w-full max-w-md mx-auto"
    >
      {items.map((item) => (
        <SocialIconItem
          key={item.id + item.url}
          item={item}
          preview={preview}
          contrastMode={contrastMode}
        />
      ))}
    </nav>
  );
}
