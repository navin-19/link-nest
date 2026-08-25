import {
  Twitter,
  Instagram,
  Youtube,
  Github,
  Linkedin,
  Facebook,
  Globe,
  Music,
  Twitch,
  Mail,
} from 'lucide-react';

const SOCIAL_PATTERNS = [
  { pattern: /twitter\.com|x\.com/i,    Icon: Twitter,   label: 'Twitter / X' },
  { pattern: /instagram\.com/i,          Icon: Instagram, label: 'Instagram' },
  { pattern: /youtube\.com|youtu\.be/i,  Icon: Youtube,   label: 'YouTube' },
  { pattern: /github\.com/i,             Icon: Github,    label: 'GitHub' },
  { pattern: /linkedin\.com/i,           Icon: Linkedin,  label: 'LinkedIn' },
  { pattern: /facebook\.com/i,           Icon: Facebook,  label: 'Facebook' },
  { pattern: /tiktok\.com/i,             Icon: Music,     label: 'TikTok' },
  { pattern: /twitch\.tv/i,              Icon: Twitch,    label: 'Twitch' },
  { pattern: /mailto:/i,                 Icon: Mail,      label: 'Email' },
];

function getIconForUrl(url) {
  for (const { pattern, Icon, label } of SOCIAL_PATTERNS) {
    if (pattern.test(url)) return { Icon, label };
  }
  return { Icon: Globe, label: 'Website' };
}

/**
 * SocialIcons with light theme pill styling and drop shadow hover.
 */
export default function SocialIcons({ links = [], size = 16 }) {
  const socialLinks = links.filter((l) =>
    SOCIAL_PATTERNS.some(({ pattern }) => pattern.test(l.url))
  );

  if (socialLinks.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2.5 flex-wrap">
      {socialLinks.map((link) => {
        const { Icon, label } = getIconForUrl(link.url);
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={[
              'p-2 rounded-full text-slate-700 hover:text-slate-950',
              'bg-white hover:bg-slate-50 border border-slate-200/80 shadow-xs hover:shadow-soft',
              'transition-all duration-150 hover:scale-110 active:scale-95',
            ].join(' ')}
          >
            <Icon size={size} />
          </a>
        );
      })}
    </div>
  );
}

export { getIconForUrl };
