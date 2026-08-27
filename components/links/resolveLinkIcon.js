import {
  InstagramIcon,
  YouTubeIcon,
  TikTokIcon,
  TwitterXIcon,
  FacebookIcon,
  LinkedInIcon,
  WhatsAppIcon,
  TelegramIcon,
  GitHubIcon,
  WebsiteIcon,
  EmailIcon,
  PhoneIcon,
} from '@/components/ui/BrandIcons';
import { Twitch } from 'lucide-react';

const ICON_MAP = {
  whatsapp:  { Icon: WhatsAppIcon, label: 'WhatsApp' },
  wa:        { Icon: WhatsAppIcon, label: 'WhatsApp' },
  facebook:  { Icon: FacebookIcon, label: 'Facebook' },
  fb:        { Icon: FacebookIcon, label: 'Facebook' },
  instagram: { Icon: InstagramIcon, label: 'Instagram' },
  ig:        { Icon: InstagramIcon, label: 'Instagram' },
  insta:     { Icon: InstagramIcon, label: 'Instagram' },
  twitter:   { Icon: TwitterXIcon, label: 'Twitter / X' },
  x:         { Icon: TwitterXIcon, label: 'Twitter / X' },
  twitterx:  { Icon: TwitterXIcon, label: 'Twitter / X' },
  telegram:  { Icon: TelegramIcon, label: 'Telegram' },
  tg:        { Icon: TelegramIcon, label: 'Telegram' },
  tme:       { Icon: TelegramIcon, label: 'Telegram' },
  email:     { Icon: EmailIcon, label: 'Email' },
  gmail:     { Icon: EmailIcon, label: 'Gmail' },
  mail:      { Icon: EmailIcon, label: 'Email' },
  phone:     { Icon: PhoneIcon, label: 'Phone' },
  call:      { Icon: PhoneIcon, label: 'Phone' },
  github:    { Icon: GitHubIcon, label: 'GitHub' },
  linkedin:  { Icon: LinkedInIcon, label: 'LinkedIn' },
  youtube:   { Icon: YouTubeIcon, label: 'YouTube' },
  yt:        { Icon: YouTubeIcon, label: 'YouTube' },
  tiktok:    { Icon: TikTokIcon, label: 'TikTok' },
  twitch:    { Icon: Twitch, label: 'Twitch' },
  website:   { Icon: WebsiteIcon, label: 'Website' },
  web:       { Icon: WebsiteIcon, label: 'Website' },
};

const URL_PATTERNS = [
  { pattern: /instagram\.com|instagr\.am/i,       Icon: InstagramIcon, label: 'Instagram' },
  { pattern: /youtube\.com|youtu\.be/i,           Icon: YouTubeIcon,   label: 'YouTube' },
  { pattern: /tiktok\.com/i,                      Icon: TikTokIcon,    label: 'TikTok' },
  { pattern: /twitter\.com|x\.com/i,              Icon: TwitterXIcon,  label: 'Twitter / X' },
  { pattern: /facebook\.com|fb\.me|fb\.com/i,     Icon: FacebookIcon,  label: 'Facebook' },
  { pattern: /linkedin\.com/i,                    Icon: LinkedInIcon,  label: 'LinkedIn' },
  { pattern: /whatsapp\.com|wa\.me/i,             Icon: WhatsAppIcon,  label: 'WhatsApp' },
  { pattern: /t\.me|telegram\.me|telegram\.org/i, Icon: TelegramIcon,  label: 'Telegram' },
  { pattern: /github\.com|github\.io/i,           Icon: GitHubIcon,    label: 'GitHub' },
  { pattern: /twitch\.tv/i,                       Icon: Twitch,        label: 'Twitch' },
  { pattern: /mailto:|gmail\.com/i,               Icon: EmailIcon,     label: 'Email' },
  { pattern: /tel:|call:/i,                       Icon: PhoneIcon,     label: 'Phone' },
];

const TITLE_PATTERNS = [
  { pattern: /\b(instagram|ig)\b/i,              Icon: InstagramIcon, label: 'Instagram' },
  { pattern: /\b(youtube|yt)\b/i,                 Icon: YouTubeIcon,   label: 'YouTube' },
  { pattern: /\b(tiktok)\b/i,                     Icon: TikTokIcon,    label: 'TikTok' },
  { pattern: /\b(twitter|x)\b/i,                  Icon: TwitterXIcon,  label: 'Twitter / X' },
  { pattern: /\b(facebook|fb)\b/i,                Icon: FacebookIcon,  label: 'Facebook' },
  { pattern: /\b(linkedin)\b/i,                   Icon: LinkedInIcon,  label: 'LinkedIn' },
  { pattern: /\b(whatsapp|wa)\b/i,                Icon: WhatsAppIcon,  label: 'WhatsApp' },
  { pattern: /\b(telegram|tg)\b/i,                Icon: TelegramIcon,  label: 'Telegram' },
  { pattern: /\b(github)\b/i,                     Icon: GitHubIcon,    label: 'GitHub' },
  { pattern: /\b(twitch)\b/i,                     Icon: Twitch,        label: 'Twitch' },
  { pattern: /\b(gmail|email|mail)\b/i,           Icon: EmailIcon,     label: 'Email' },
  { pattern: /\b(phone|call)\b/i,                 Icon: PhoneIcon,     label: 'Phone' },
];

/**
 * Single source of truth for resolving brand icons across management list and live preview.
 * Prioritizes explicit `link.icon` / `link.platform`, then inspects URL, then title, then defaults to WebsiteIcon.
 */
export function resolveLinkIcon(linkOrUrl) {
  if (!linkOrUrl) return { Icon: WebsiteIcon, label: 'Website' };

  // If passed a plain URL string
  if (typeof linkOrUrl === 'string') {
    const trimmed = linkOrUrl.trim();
    for (const { pattern, Icon, label } of URL_PATTERNS) {
      if (pattern.test(trimmed)) return { Icon, label };
    }
    return { Icon: WebsiteIcon, label: 'Website' };
  }

  const link = linkOrUrl;

  // 1. Explicit icon / platform identifier from Quick Add or creation
  const explicitKey = (link.icon || link.platform || '')?.toString().toLowerCase().trim();
  if (explicitKey && ICON_MAP[explicitKey]) {
    return ICON_MAP[explicitKey];
  }

  // 2. URL regex pattern matching
  const url = link.url || '';
  for (const { pattern, Icon, label } of URL_PATTERNS) {
    if (pattern.test(url)) return { Icon, label };
  }

  // 3. Title pattern matching
  const title = link.title || '';
  for (const { pattern, Icon, label } of TITLE_PATTERNS) {
    if (pattern.test(title)) return { Icon, label };
  }

  // 4. Fallback
  return { Icon: WebsiteIcon, label: 'Website' };
}

export default resolveLinkIcon;
