import {
  InstagramIcon,
  YouTubeIcon,
  TikTokIcon,
  TwitterXIcon,
  FacebookIcon,
  LinkedInIcon,
  WhatsAppIcon,
  GitHubIcon,
  WebsiteIcon,
  EmailIcon,
} from '@/components/ui/BrandIcons';
import { Twitch } from 'lucide-react';

const PLATFORM_MAP = {
  instagram: { Icon: InstagramIcon, label: 'Instagram', format: (v) => v.startsWith('http') ? v : `https://instagram.com/${v.replace(/^@/, '')}` },
  youtube:   { Icon: YouTubeIcon,   label: 'YouTube',   format: (v) => v.startsWith('http') ? v : `https://youtube.com/${v.startsWith('@') ? v : '@' + v}` },
  tiktok:    { Icon: TikTokIcon,    label: 'TikTok',    format: (v) => v.startsWith('http') ? v : `https://tiktok.com/${v.startsWith('@') ? v : '@' + v}` },
  twitter:   { Icon: TwitterXIcon,  label: 'Twitter / X', format: (v) => v.startsWith('http') ? v : `https://x.com/${v.replace(/^@/, '')}` },
  facebook:  { Icon: FacebookIcon,  label: 'Facebook',  format: (v) => v.startsWith('http') ? v : `https://facebook.com/${v}` },
  linkedin:  { Icon: LinkedInIcon,  label: 'LinkedIn',  format: (v) => v.startsWith('http') ? v : `https://linkedin.com/in/${v}` },
  whatsapp:  { Icon: WhatsAppIcon,  label: 'WhatsApp',  format: (v) => v.startsWith('http') ? v : `https://wa.me/${v.replace(/[^0-9]/g, '')}` },
  github:    { Icon: GitHubIcon,    label: 'GitHub',    format: (v) => v.startsWith('http') ? v : `https://github.com/${v.replace(/^@/, '')}` },
  twitch:    { Icon: Twitch,        label: 'Twitch',    format: (v) => v.startsWith('http') ? v : `https://twitch.tv/${v}` },
  email:     { Icon: EmailIcon,     label: 'Email',     format: (v) => v.startsWith('mailto:') ? v : `mailto:${v}` },
};

const SOCIAL_PATTERNS = [
  { pattern: /instagram\.com/i,          Icon: InstagramIcon, label: 'Instagram' },
  { pattern: /youtube\.com|youtu\.be/i,  Icon: YouTubeIcon,   label: 'YouTube' },
  { pattern: /tiktok\.com/i,             Icon: TikTokIcon,    label: 'TikTok' },
  { pattern: /twitter\.com|x\.com/i,    Icon: TwitterXIcon,  label: 'Twitter / X' },
  { pattern: /facebook\.com|fb\.me/i,    Icon: FacebookIcon,  label: 'Facebook' },
  { pattern: /linkedin\.com/i,           Icon: LinkedInIcon,  label: 'LinkedIn' },
  { pattern: /whatsapp\.com|wa\.me/i,    Icon: WhatsAppIcon,  label: 'WhatsApp' },
  { pattern: /github\.com/i,             Icon: GitHubIcon,    label: 'GitHub' },
  { pattern: /twitch\.tv/i,              Icon: Twitch,        label: 'Twitch' },
  { pattern: /mailto:/i,                 Icon: EmailIcon,     label: 'Email' },
];

function getIconForUrl(url) {
  if (!url) return { Icon: WebsiteIcon, label: 'Website' };
  for (const { pattern, Icon, label } of SOCIAL_PATTERNS) {
    if (pattern.test(url)) return { Icon, label };
  }
  return { Icon: WebsiteIcon, label: 'Website' };
}

/**
 * Minimalist SocialIcons component.
 * Reads primary social links from profile.social_links (or fallback to auto-detected links).
 */
export default function SocialIcons({ profile, socialLinks: customSocialLinks, links = [], size = 20, preview = false }) {
  const profileSocial = customSocialLinks || profile?.social_links;

  // 1. Primary: Use dedicated profile.social_links if available
  if (profileSocial && typeof profileSocial === 'object') {
    const items = Object.entries(profileSocial)
      .filter(([_, val]) => typeof val === 'string' && val.trim().length > 0)
      .map(([platform, val]) => {
        const config = PLATFORM_MAP[platform.toLowerCase()];
        if (!config) return null;
        return {
          id: platform,
          url: config.format(val.trim()),
          Icon: config.Icon,
          label: config.label,
        };
      })
      .filter(Boolean);

    if (items.length > 0) {
      return (
        <div className="flex items-center justify-center gap-3 flex-wrap py-2">
          {items.map((item) => {
            const Icon = item.Icon;
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                title={item.label}
                className="flex items-center justify-center shrink-0 text-slate-600 hover:text-slate-900 transition-colors p-1"
              >
                <Icon size={size} className="shrink-0" />
              </a>
            );
          })}
        </div>
      );
    }
  }

  // 2. Fallback: Auto-detected from links array if no dedicated social_links
  const fallbackSocial = links.filter((l) =>
    l.is_active && SOCIAL_PATTERNS.some(({ pattern }) => pattern.test(l.url))
  );

  if (fallbackSocial.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap py-2">
      {fallbackSocial.map((link) => {
        const { Icon, label } = getIconForUrl(link.url);
        return (
          <a
            key={link.id}
            href={preview ? link.url : `/api/track/${link.id}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="flex items-center justify-center shrink-0 text-slate-600 hover:text-slate-900 transition-colors p-1"
          >
            <Icon size={size} className="shrink-0" />
          </a>
        );
      })}
    </div>
  );
}

export { getIconForUrl };
