'use client';

import React from 'react';
import { resolveLinkIcon } from '@/components/links/resolveLinkIcon';

// Official platform vector paths
function PhoneLogo({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

function WhatsAppLogo({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.031 2C6.516 2 2.031 6.485 2.031 12a9.96 9.96 0 0 0 1.529 5.309L2 22l4.823-1.528A9.96 9.96 0 0 0 12.031 22C17.546 22 22.031 17.515 22.031 12S17.546 2 12.031 2zm0 18.232c-1.643 0-3.21-.439-4.58-1.258l-.328-.195-3.411 1.082 1.096-3.327-.214-.341a8.163 8.163 0 0 1-1.256-4.193c0-4.538 3.693-8.231 8.231-8.231 4.538 0 8.231 3.693 8.231 8.231 0 4.538-3.693 8.232-8.231 8.232zm4.512-6.175c-.247-.124-1.464-.722-1.691-.805-.227-.082-.392-.124-.557.124-.165.247-.639.805-.783.97-.144.165-.289.186-.536.062-.247-.124-1.044-.385-1.988-1.227-.735-.656-1.231-1.465-1.375-1.712-.144-.247-.015-.381.108-.504.111-.111.247-.289.371-.433.124-.144.165-.247.247-.412.082-.165.041-.309-.021-.433-.062-.124-.557-1.34-.763-1.835-.2-.485-.403-.418-.557-.426-.144-.008-.309-.01-.474-.01-.165 0-.433.062-.66.309-.227.247-.866.845-.866 2.062s.887 2.392 1.01 2.557c.124.165 1.742 2.66 4.22 3.731.59.255 1.05.407 1.41.522.593.188 1.132.161 1.558.098.475-.071 1.464-.598 1.67-1.175.206-.577.206-1.072.144-1.175-.062-.103-.227-.165-.474-.289z" />
    </svg>
  );
}

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

function TelegramLogo({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  );
}

function EmailLogo({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
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
  whatsapp: {
    Icon: WhatsAppLogo,
    label: 'WhatsApp',
    format: (v) => (v.startsWith('http') ? v : `https://wa.me/${v.replace(/\D/g, '')}`),
  },
  phone: {
    Icon: PhoneLogo,
    label: 'Phone / Call',
    format: (v) => {
      const c = v.replace(/[^\d+]/g, '');
      return c.startsWith('tel:') ? c : `tel:${c}`;
    },
  },
  call: {
    Icon: PhoneLogo,
    label: 'Phone / Call',
    format: (v) => {
      const c = v.replace(/[^\d+]/g, '');
      return c.startsWith('tel:') ? c : `tel:${c}`;
    },
  },
  telegram: {
    Icon: TelegramLogo,
    label: 'Telegram',
    format: (v) => (v.startsWith('http') ? v : `https://t.me/${v.replace(/^@/, '')}`),
  },
  email: {
    Icon: EmailLogo,
    label: 'Email',
    format: (v) => (v.startsWith('mailto:') ? v : `mailto:${v}`),
  },
  website: {
    Icon: WebsiteLogo,
    label: 'Website',
    format: (v) => (v.startsWith('http') ? v : `https://${v}`),
  },
};

/**
 * Shared SocialIcon Button Component:
 * Circular button with subtle border, dark translucent background, and hover scale.
 */
export function SocialIconItem({ item, preview = false, onTrack }) {
  const Icon = item.Icon;
  const isNativeLink = item.id === 'phone' || item.id === 'call' || item.id === 'email';

  return (
    <a
      href={item.url}
      target={isNativeLink ? undefined : '_blank'}
      rel={isNativeLink ? undefined : 'noopener noreferrer'}
      aria-label={item.label}
      title={item.label}
      onClick={() => onTrack && onTrack(item.id)}
      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#111322]/80 dark:bg-black/70 hover:bg-[#181c33] text-white border border-white/15 shadow-md flex items-center justify-center shrink-0 transition-all duration-150 ease-out hover:scale-110 active:scale-95 cursor-pointer select-none"
    >
      <Icon size={18} className="shrink-0 text-white" />
    </a>
  );
}

/**
 * SocialIcons Section
 */
export default function SocialIcons({
  profile,
  socialLinks: customSocialLinks,
  preview = false,
}) {
  const profileSocial = customSocialLinks || profile?.social_links;
  if (!profileSocial || typeof profileSocial !== 'object') return null;

  const items = Object.entries(profileSocial)
    .filter(([_, val]) => typeof val === 'string' && val.trim().length > 0)
    .map(([platform, rawVal]) => {
      const val = rawVal.trim();
      const platformKey = platform.toLowerCase();

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
    .filter((item) => Boolean(item.Icon));

  if (items.length === 0) return null;

  function handleIconClick(platformId) {
    if (preview) return;
    if (platformId === 'whatsapp' || platformId === 'phone' || platformId === 'call') {
      try {
        fetch('/api/track/social-click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profileUserId: profile?.id,
            click_type: platformId === 'whatsapp' ? 'whatsapp' : 'call',
          }),
        }).catch(() => {});
      } catch (err) {
        // Non-blocking
      }
    }
  }

  return (
    <nav
      aria-label="Social media links"
      className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap py-2 w-full max-w-md mx-auto"
    >
      {items.map((item) => (
        <SocialIconItem
          key={item.id + item.url}
          item={item}
          preview={preview}
          onTrack={handleIconClick}
        />
      ))}
    </nav>
  );
}
