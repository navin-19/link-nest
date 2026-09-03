/**
 * Supported Social Links & Quick Links Configuration
 * 
 * 1. SOCIAL_FIELDS: Pure social media channels (feeds "Follow Us" row)
 * 2. QUICK_LINK_FIELDS: Direct customer/contact action buttons (feeds "Quick Links" / "Contact Details" popup)
 */

export const SOCIAL_FIELDS = [
  { id: 'instagram', label: 'Instagram',   icon: 'instagram', placeholder: 'https://instagram.com/username' },
  { id: 'youtube',   label: 'YouTube',     icon: 'youtube',   placeholder: 'https://youtube.com/@channel' },
  { id: 'tiktok',    label: 'TikTok',      icon: 'tiktok',    placeholder: 'https://tiktok.com/@username' },
  { id: 'twitter',   label: 'Twitter / X', icon: 'twitter',   placeholder: 'https://x.com/username' },
  { id: 'facebook',  label: 'Facebook',    icon: 'facebook',  placeholder: 'https://facebook.com/yourpage' },
  { id: 'linkedin',  label: 'LinkedIn',    icon: 'linkedin',  placeholder: 'https://linkedin.com/in/profile' },
  { id: 'github',    label: 'GitHub',      icon: 'github',    placeholder: 'https://github.com/username' },
  { id: 'twitch',    label: 'Twitch',      icon: 'twitch',    placeholder: 'https://twitch.tv/username' },
  { id: 'telegram',  label: 'Telegram',    icon: 'telegram',  placeholder: 'https://t.me/username' },
  { id: 'website',   label: 'Website',     icon: 'website',   placeholder: 'https://yourwebsite.com' },
];

export const QUICK_LINK_FIELDS = [
  { id: 'whatsapp',  label: 'WhatsApp',            icon: 'whatsapp', placeholder: '+1234567890 (or https://wa.me/...)' },
  { id: 'phone',     label: 'Phone / Direct Call', icon: 'phone',    placeholder: '+1234567890' },
  { id: 'email',     label: 'Email Address',       icon: 'email',    placeholder: 'you@example.com' },
];

export const SOCIAL_DISPLAY_TITLES = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  twitter: 'Twitter / X',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  twitch: 'Twitch',
  telegram: 'Telegram',
  website: 'Website',
};

export const QUICK_LINK_DISPLAY_TITLES = {
  whatsapp: 'WhatsApp',
  phone: 'Phone / Direct Call',
  email: 'Email Address',
};

/**
 * Formats a raw user input into a proper URL / scheme for the given social platform.
 */
export function formatSocialLinkUrl(key, val) {
  if (!val || typeof val !== 'string') return '';
  const trimmed = val.trim();
  if (!trimmed) return '';

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return trimmed;
  }

  switch (key) {
    case 'instagram':
      return `https://instagram.com/${trimmed.replace(/^@/, '')}`;
    case 'youtube':
      return trimmed.startsWith('@') ? `https://youtube.com/${trimmed}` : `https://youtube.com/@${trimmed}`;
    case 'tiktok':
      return `https://tiktok.com/@${trimmed.replace(/^@/, '')}`;
    case 'twitter':
    case 'x':
      return `https://x.com/${trimmed.replace(/^@/, '')}`;
    case 'facebook':
      return `https://facebook.com/${trimmed.replace(/^@/, '')}`;
    case 'linkedin':
      return trimmed.startsWith('in/') ? `https://linkedin.com/${trimmed}` : `https://linkedin.com/in/${trimmed}`;
    case 'github':
      return `https://github.com/${trimmed.replace(/^@/, '')}`;
    case 'twitch':
      return `https://twitch.tv/${trimmed.replace(/^@/, '')}`;
    case 'telegram':
      return `https://t.me/${trimmed.replace(/^@/, '')}`;
    case 'website':
      return `https://${trimmed}`;
    case 'whatsapp': {
      const digitsOnly = trimmed.replace(/[^\d]/g, '');
      return `https://wa.me/${digitsOnly}`;
    }
    case 'phone':
      return `tel:${trimmed.replace(/[^\d+]/g, '')}`;
    case 'email':
      return `mailto:${trimmed.replace(/^mailto:/, '')}`;
    default:
      return `https://${trimmed}`;
  }
}

export function formatQuickLinkUrl(key, val) {
  return formatSocialLinkUrl(key, val);
}

/**
 * Converts a social_links object into a list of pure Social links for Follow Us row.
 */
export function getSocialLinksList(socialLinks = {}) {
  if (!socialLinks || typeof socialLinks !== 'object') return [];

  const items = [];
  for (const field of SOCIAL_FIELDS) {
    const rawVal = socialLinks[field.id];
    if (rawVal && typeof rawVal === 'string' && rawVal.trim()) {
      const formattedUrl = formatSocialLinkUrl(field.id, rawVal);
      items.push({
        id: `social-${field.id}`,
        key: field.id,
        title: SOCIAL_DISPLAY_TITLES[field.id] || field.label,
        url: formattedUrl,
        icon: field.icon,
        is_active: true,
      });
    }
  }
  return items;
}

/**
 * Converts quick_links (with backward compatibility fallback to social_links and reach_out) into Contact Details modal items.
 * Returns each item with its title, value (phone number, WhatsApp number, email ID), formatted URL, and icon.
 */
export function getQuickLinksList(quickLinks = {}, socialLinks = {}, reachOut = {}) {
  const merged = {
    whatsapp: (quickLinks && quickLinks.whatsapp) || (socialLinks && socialLinks.whatsapp) || '',
    phone: (quickLinks && quickLinks.phone) || (socialLinks && socialLinks.phone) || (reachOut && reachOut.phone) || '',
    email: (quickLinks && quickLinks.email) || (socialLinks && socialLinks.email) || (reachOut && reachOut.email) || '',
  };

  const items = [];
  for (const field of QUICK_LINK_FIELDS) {
    const rawVal = merged[field.id];
    if (rawVal && typeof rawVal === 'string' && rawVal.trim()) {
      const formattedUrl = formatQuickLinkUrl(field.id, rawVal);
      items.push({
        id: `quick-${field.id}`,
        key: field.id,
        title: QUICK_LINK_DISPLAY_TITLES[field.id] || field.label,
        value: rawVal.trim(),
        url: formattedUrl,
        icon: field.icon,
        is_active: true,
      });
    }
  }
  return items;
}
