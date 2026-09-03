'use client';

import React from 'react';

// Official platform vector paths for the 4 supported platforms
function FacebookLogo({ size = 22, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramLogo({ size = 22, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function YouTubeLogo({ size = 22, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function LinkedInLogo({ size = 22, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

const PLATFORM_MAP = {
  youtube: {
    Icon: YouTubeLogo,
    label: 'YouTube',
    format: (v) => (v.startsWith('http') ? v : `https://youtube.com/${v.startsWith('@') ? v : '@' + v}`),
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
  instagram: {
    Icon: InstagramLogo,
    label: 'Instagram',
    format: (v) => (v.startsWith('http') ? v : `https://instagram.com/${v.replace(/^@/, '')}`),
  },
};

const ALLOWED_PLATFORMS = new Set(['youtube', 'facebook', 'linkedin', 'instagram']);

/**
 * Shared SocialIcon Button Component:
 * Bare monochrome icon link directly on page background.
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
      className={`p-2 rounded-full transition-all duration-150 ease-out hover:scale-110 active:scale-95 cursor-pointer select-none ${
        isLight
          ? 'text-slate-900 hover:text-slate-700'
          : 'text-white hover:text-slate-200'
      }`}
    >
      <Icon size={22} className="shrink-0" />
    </a>
  );
}

/**
 * SocialIcons Section - Bare monochrome icons for 4 platforms only:
 * YouTube, Facebook, LinkedIn, Instagram
 */
export default function SocialIcons({
  profile,
  socialLinks: customSocialLinks,
  preview = false,
  contrastMode = 'dark',
}) {
  const profileSocial = customSocialLinks || profile?.social_links;
  if (!profileSocial || typeof profileSocial !== 'object') return null;

  // Filter strictly to the 4 requested platforms: YouTube, Facebook, LinkedIn, Instagram
  const items = Object.entries(profileSocial)
    .filter(([platform, val]) => {
      const key = platform.toLowerCase();
      return ALLOWED_PLATFORMS.has(key) && typeof val === 'string' && val.trim().length > 0;
    })
    .map(([platform, rawVal]) => {
      const val = rawVal.trim();
      const platformKey = platform.toLowerCase();
      const config = PLATFORM_MAP[platformKey];
      if (!config) return null;

      return {
        id: platformKey,
        url: config.format(val),
        Icon: config.Icon,
        label: config.label,
      };
    })
    .filter((item) => Boolean(item && item.Icon));

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Social media links"
      className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap py-2 w-full max-w-md mx-auto"
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
