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
import { getContrastMode } from '@/utils/getContrastMode';

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

/**
 * Minimalist SocialIcons component.
 * Reads primary social links exclusively from profile.social_links (configured in settings).
 */
export default function SocialIcons({
  profile,
  socialLinks: customSocialLinks,
  size = 20,
  preview = false,
  contrastMode,
  theme,
}) {
  const profileSocial = customSocialLinks || profile?.social_links;
  if (!profileSocial || typeof profileSocial !== 'object') return null;

  const isDark =
    contrastMode === 'dark' ||
    getContrastMode(theme?.background || profile?.themes?.background) === 'dark';

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

  if (items.length === 0) return null;

  const iconLinkClass = isDark
    ? 'flex items-center justify-center shrink-0 text-white/80 hover:text-white hover:scale-110 transition-all p-1'
    : 'flex items-center justify-center shrink-0 text-slate-600 hover:text-slate-900 hover:scale-110 transition-all p-1';

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
            className={iconLinkClass}
          >
            <Icon size={size} className="shrink-0" />
          </a>
        );
      })}
    </div>
  );
}
