'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Link2, Type } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { validateUrl, validateLinkTitle } from '@/utils/validators';
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
} from '@/components/ui/BrandIcons';

// Quick-add platform shortcuts: YouTube, Instagram, TikTok, Twitter/X, Facebook, LinkedIn, WhatsApp, Telegram, GitHub, Email, Website
const QUICK_PLATFORMS = [
  {
    id: 'youtube',
    label: 'YouTube',
    icon: YouTubeIcon,
    placeholder: 'https://youtube.com/@yourchannel',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: InstagramIcon,
    placeholder: 'https://instagram.com/yourhandle',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: TikTokIcon,
    placeholder: 'https://tiktok.com/@yourhandle',
  },
  {
    id: 'twitter',
    label: 'Twitter / X',
    icon: TwitterXIcon,
    placeholder: 'https://x.com/yourhandle',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: FacebookIcon,
    placeholder: 'https://facebook.com/yourpage',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: LinkedInIcon,
    placeholder: 'https://linkedin.com/in/yourprofile',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: WhatsAppIcon,
    placeholder: 'https://wa.me/1234567890',
  },
  {
    id: 'telegram',
    label: 'Telegram',
    icon: TelegramIcon,
    placeholder: 'https://t.me/yourhandle',
  },
  {
    id: 'github',
    label: 'GitHub',
    icon: GitHubIcon,
    placeholder: 'https://github.com/yourhandle',
  },
  {
    id: 'email',
    label: 'Email',
    icon: EmailIcon,
    placeholder: 'mailto:you@example.com',
  },
  {
    id: 'website',
    label: 'Website',
    icon: WebsiteIcon,
    placeholder: 'https://yourwebsite.com',
  },
];

export default function AddLinkForm({ onAdd }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [urlPlaceholder, setUrlPlaceholder] = useState('https://...');
  const [icon, setIcon] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const urlInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && urlInputRef.current) {
      urlInputRef.current.focus();
    }
  }, [isOpen]);

  function handleQuickAdd(platform) {
    setTitle(platform.label);
    setUrl('');
    setUrlPlaceholder(platform.placeholder);
    setIcon(platform.id);
    setErrors({});
    setIsOpen(true);
  }

  function handleOpenManual() {
    setTitle('');
    setUrl('');
    setUrlPlaceholder('https://...');
    setIcon(null);
    setErrors({});
    setIsOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});

    const titleValidation = validateLinkTitle(title);
    if (!titleValidation.valid) {
      setErrors((prev) => ({ ...prev, title: titleValidation.error }));
      return;
    }

    const urlValidation = validateUrl(url);
    if (!urlValidation.valid) {
      setErrors((prev) => ({ ...prev, url: urlValidation.error }));
      return;
    }

    setLoading(true);
    try {
      await onAdd({ title: title.trim(), url: url.trim(), icon: icon });
      setTitle('');
      setUrl('');
      setIcon(null);
      setIsOpen(false);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to create link' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {/* ── Quick-Add Brand Icon Row (Full-color logo marks only, no text labels) ── */}
      <div className="p-4 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Quick Add Links
          </span>
        </div>
        <div className="flex items-center justify-center gap-3 overflow-x-auto pb-1.5 pt-0.5 px-0.5 scrollbar-none w-full">
          {QUICK_PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => handleQuickAdd(platform)}
                aria-label={`Add ${platform.label} link`}
                title={`Add ${platform.label} link`}
                className="group relative flex items-center justify-center shrink-0 transition-all duration-150 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-slate-900/20 dark:focus:ring-white/20 rounded-xl cursor-pointer"
              >
                <Icon size={36} className="shrink-0 drop-shadow-2xs transition-transform group-hover:brightness-105" />
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Add New Link Form / Button ─────────────────────────────────── */}
      {!isOpen ? (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleOpenManual}
          className="py-3.5 shadow-btn hover:shadow-btn-hover"
        >
          <Plus size={18} />
          Add Custom Link
        </Button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-card animate-slide-down text-slate-900 dark:text-slate-100"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              {title ? `Add ${title} Link` : 'Add New Link'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setErrors({});
              }}
              className="text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>

          {errors.form && (
            <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/60 rounded-xl">
              {errors.form}
            </div>
          )}

          <Input
            id="link-title-input"
            label="Title"
            placeholder="e.g. My Portfolio / Latest Video / Shop"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            leadingIcon={Type}
            required
          />

          <div>
            <Input
              ref={urlInputRef}
              id="link-url-input"
              label="URL"
              placeholder={urlPlaceholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              error={errors.url}
              leadingIcon={Link2}
              type="url"
              required
            />
            {urlPlaceholder !== 'https://...' && !url && (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 pl-1">
                Paste your profile link (e.g. <span className="font-mono text-slate-500 dark:text-slate-400">{urlPlaceholder}</span>)
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsOpen(false);
                setErrors({});
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={loading}
              className="shadow-btn hover:shadow-btn-hover"
            >
              Save Link
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
