'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Share2,
  CheckCircle2,
  AlertCircle,
  Info,
  Save,
  Globe,
} from 'lucide-react';
import {
  InstagramIcon,
  YouTubeIcon,
  TikTokIcon,
  TwitterXIcon,
  FacebookIcon,
  LinkedInIcon,
  GitHubIcon,
  TwitchIcon,
  TelegramIcon,
  WebsiteIcon,
} from '@/components/ui/BrandIcons';
import Heading from '@/components/ui/Heading';
import { SOCIAL_FIELDS } from './socialLinksHelper';

function BrandSwatch({ platformId }) {
  switch (platformId) {
    case 'instagram':
      return (
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs overflow-hidden">
          <InstagramIcon size={20} />
        </div>
      );
    case 'youtube':
      return (
        <div className="w-8 h-8 rounded-lg bg-[#FF0000] flex items-center justify-center text-white shrink-0 shadow-2xs">
          <YouTubeIcon size={20} />
        </div>
      );
    case 'tiktok':
      return (
        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white shrink-0 shadow-2xs">
          <TikTokIcon size={20} />
        </div>
      );
    case 'twitter':
    case 'x':
      return (
        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white shrink-0 shadow-2xs">
          <TwitterXIcon size={20} />
        </div>
      );
    case 'facebook':
      return (
        <div className="w-8 h-8 rounded-lg bg-[#1877F2] flex items-center justify-center text-white shrink-0 shadow-2xs">
          <FacebookIcon size={20} />
        </div>
      );
    case 'linkedin':
      return (
        <div className="w-8 h-8 rounded-lg bg-[#0A66C2] flex items-center justify-center text-white shrink-0 shadow-2xs">
          <LinkedInIcon size={20} />
        </div>
      );
    case 'github':
      return (
        <div className="w-8 h-8 rounded-lg bg-[#24292F] flex items-center justify-center text-white shrink-0 shadow-2xs">
          <GitHubIcon size={20} />
        </div>
      );
    case 'twitch':
      return (
        <div className="w-8 h-8 rounded-lg bg-[#9146FF] flex items-center justify-center text-white shrink-0 shadow-2xs">
          <TwitchIcon size={20} />
        </div>
      );
    case 'telegram':
      return (
        <div className="w-8 h-8 rounded-lg bg-[#229ED9] flex items-center justify-center text-white shrink-0 shadow-2xs">
          <TelegramIcon size={20} />
        </div>
      );
    case 'website':
      return (
        <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white shrink-0 shadow-2xs">
          <WebsiteIcon size={20} />
        </div>
      );
    default:
      return (
        <div className="w-8 h-8 rounded-lg bg-slate-700 dark:bg-slate-800 flex items-center justify-center text-white shrink-0 shadow-2xs">
          <Globe size={15} />
        </div>
      );
  }
}

export default function SocialLinksEditor({ profile, onLocalProfileChange }) {
  const router = useRouter();
  const [socialLinks, setSocialLinks] = useState(profile?.social_links || {});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (profile?.social_links) {
      setSocialLinks(profile.social_links);
    }
  }, [profile?.social_links]);

  function handleChange(platform, value) {
    const updated = {
      ...socialLinks,
      [platform]: value,
    };
    setSocialLinks(updated);

    if (onLocalProfileChange) {
      onLocalProfileChange({ social_links: updated });
    }
  }

  async function handleSave(e) {
    if (e) e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          social_links: socialLinks,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update social links');

      router.refresh();
      setMessage('Social links updated successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('[SocialLinksEditor error]', err);
      setError(err.message || 'Failed to save social links');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header card */}
      <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-6 transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <Heading as="h3" className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Share2 size={13} />
              </div>
              Social Links
            </Heading>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Add your social media channels and website. Only filled fields appear on your public profile&apos;s Follow Us row.
            </p>
          </div>
        </div>

        {/* Notifications */}
        {message && (
          <div className="p-3.5 text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-2 font-medium animate-fade-in">
            <CheckCircle2 size={16} className="shrink-0" /> {message}
          </div>
        )}

        {error && (
          <div className="p-3.5 text-xs text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-2 font-medium animate-slide-down">
            <AlertCircle size={16} className="shrink-0" /> {error}
          </div>
        )}

        {/* Form Inputs Grid */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SOCIAL_FIELDS.map((platform) => (
              <div key={platform.id} className="space-y-1.5 text-left">
                <label
                  htmlFor={`social-${platform.id}`}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  {platform.label}
                </label>

                <div className="relative flex items-center rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all p-1.5 gap-2.5">
                  {/* Left edge branded swatch */}
                  <BrandSwatch platformId={platform.id} />

                  {/* Input field */}
                  <input
                    id={`social-${platform.id}`}
                    type="text"
                    placeholder={platform.placeholder}
                    value={socialLinks[platform.id] || ''}
                    onChange={(e) => handleChange(platform.id, e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none pr-2"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Helper Note + Right-Aligned Save Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Info size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Social links reflect on your public profile immediately.</span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-btn hover:shadow-btn-hover transition-all active:scale-[0.98] cursor-pointer self-end"
            >
              {saving ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <Save size={14} />
              )}
              <span>Save Social Links</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
