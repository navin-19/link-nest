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
 * SocialIcons with light theme pill styling and drop shadow hover.
 */
export default function SocialIcons({ links = [], size = 20, preview = false }) {
  const socialLinks = links.filter((l) =>
    l.is_active && SOCIAL_PATTERNS.some(({ pattern }) => pattern.test(l.url))
  );

  if (socialLinks.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2.5 flex-wrap">
      {socialLinks.map((link) => {
        const { Icon, label } = getIconForUrl(link.url);
        return (
          <a
            key={link.id}
            href={preview ? link.url : `/api/track/${link.id}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="flex items-center justify-center shrink-0 hover:scale-110 active:scale-95 transition-all focus:outline-none"
          >
            <Icon size={28} className="shrink-0 drop-shadow-2xs" />
          </a>
        );
      })}
    </div>
  );
}

export { getIconForUrl };
