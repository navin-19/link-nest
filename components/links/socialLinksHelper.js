/**
 * Supported Social Links Fields & Configuration
 * Reordered by most-used priority (GitHub & TikTok removed):
 * 1. WhatsApp
 * 2. Instagram
 * 3. Phone / Direct Call
 * 4. Email Address
 * 5. Facebook
 * 6. YouTube
 * 7. Website
 * 8. Twitter / X
 * 9. LinkedIn
 * 10. Telegram
 */

export const SOCIAL_FIELDS = [
  { id: 'whatsapp',  label: 'WhatsApp',            icon: 'whatsapp',  placeholder: '+1234567890 (or https://wa.me/...)' },
  { id: 'instagram', label: 'Instagram',           icon: 'instagram', placeholder: 'https://instagram.com/username' },
  { id: 'phone',     label: 'Phone / Direct Call', icon: 'phone',     placeholder: '+1234567890' },
  { id: 'email',     label: 'Email Address',       icon: 'email',     placeholder: 'you@example.com' },
  { id: 'facebook',  label: 'Facebook',            icon: 'facebook',  placeholder: 'https://facebook.com/yourpage' },
  { id: 'youtube',   label: 'YouTube',             icon: 'youtube',   placeholder: 'https://youtube.com/@channel' },
  { id: 'website',   label: 'Website',             icon: 'website',   placeholder: 'https://yourwebsite.com' },
  { id: 'twitter',   label: 'Twitter / X',         icon: 'twitter',   placeholder: 'https://x.com/username' },
  { id: 'linkedin',  label: 'LinkedIn',            icon: 'linkedin',  placeholder: 'https://linkedin.com/in/profile' },
  { id: 'telegram',  label: 'Telegram',            icon: 'telegram',  placeholder: 'https://t.me/username' },
];

export const SOCIAL_DISPLAY_TITLES = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  phone: 'Phone',
  email: 'Email',
  facebook: 'Facebook',
  youtube: 'YouTube',
  website: 'Website',
  twitter: 'Twitter / X',
  linkedin: 'LinkedIn',
  telegram: 'Telegram',
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
    case 'whatsapp': {
      const digitsOnly = trimmed.replace(/[^\d+]/g, '').replace(/^\+/, '');
      return `https://wa.me/${digitsOnly}`;
    }
    case 'instagram':
      return `https://instagram.com/${trimmed.replace(/^@/, '')}`;
    case 'phone':
      return `tel:${trimmed.replace(/[^\d+]/g, '')}`;
    case 'email':
      return `mailto:${trimmed}`;
    case 'facebook':
      return `https://facebook.com/${trimmed.replace(/^@/, '')}`;
    case 'youtube':
      return trimmed.startsWith('@') ? `https://youtube.com/${trimmed}` : `https://youtube.com/@${trimmed}`;
    case 'website':
      return `https://${trimmed}`;
    case 'twitter':
      return `https://x.com/${trimmed.replace(/^@/, '')}`;
    case 'linkedin':
      return trimmed.startsWith('in/') ? `https://linkedin.com/${trimmed}` : `https://linkedin.com/in/${trimmed}`;
    case 'telegram':
      return `https://t.me/${trimmed.replace(/^@/, '')}`;
    default:
      return `https://${trimmed}`;
  }
}

/**
 * Converts a social_links object into a list of Quick Link cards in fixed priority order.
 * Automatically skips fields with no value, and ignores removed fields (e.g. github, tiktok).
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
