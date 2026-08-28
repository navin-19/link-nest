'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import {
  Share2,
  CheckCircle2,
  AlertCircle,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
  Phone,
  MessageCircle,
  Github,
  Tv,
  Send,
  Mail,
} from 'lucide-react';

const SOCIAL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username', icon: Instagram },
  { id: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@channel', icon: Youtube },
  { id: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@username', icon: Share2 },
  { id: 'twitter', label: 'Twitter / X', placeholder: 'https://x.com/username', icon: Twitter },
  { id: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/page', icon: Facebook },
  { id: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/profile', icon: Linkedin },
  { id: 'whatsapp', label: 'WhatsApp', placeholder: '+1234567890 (or https://wa.me/...)', icon: MessageCircle },
  { id: 'phone', label: 'Phone / Direct Call', placeholder: '+1234567890 (direct phone call)', icon: Phone },
  { id: 'github', label: 'GitHub', placeholder: 'https://github.com/username', icon: Github },
  { id: 'twitch', label: 'Twitch', placeholder: 'https://twitch.tv/username', icon: Tv },
  { id: 'telegram', label: 'Telegram', placeholder: 'https://t.me/username', icon: Send },
  { id: 'email', label: 'Email Address', placeholder: 'mailto:you@example.com', icon: Mail },
];

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
      <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Share2 size={18} className="text-indigo-600" /> Social Links
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Add your social media URLs and contact links to display minimal branded icon buttons on your profile.
            </p>
          </div>
        </div>

        {/* Notifications */}
        {message && (
          <div className="p-3.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 font-medium animate-fade-in">
            <CheckCircle2 size={16} className="shrink-0" /> {message}
          </div>
        )}

        {error && (
          <div className="p-3.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 font-medium animate-slide-down">
            <AlertCircle size={16} className="shrink-0" /> {error}
          </div>
        )}

        {/* Form Inputs Grid */}
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SOCIAL_PLATFORMS.map((platform) => {
              const Icon = platform.icon;
              return (
                <div key={platform.id} className="space-y-1.5">
                  <Input
                    id={`social-${platform.id}`}
                    label={platform.label}
                    placeholder={platform.placeholder}
                    value={socialLinks[platform.id] || ''}
                    onChange={(e) => handleChange(platform.id, e.target.value)}
                    leadingIcon={Icon}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Icons automatically appear on your live preview and public page.
            </p>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={saving}
              className="shadow-btn hover:shadow-btn-hover text-xs font-bold px-6 py-2.5"
            >
              Save Social Links
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
