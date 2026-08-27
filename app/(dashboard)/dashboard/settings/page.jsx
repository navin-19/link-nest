'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabaseClient';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Avatar from '@/components/profile/Avatar';
import { Upload, AtSign, User, FileText, CheckCircle2 } from 'lucide-react';
import { validateUsername, normalizeUsername } from '@/utils/validators';
import GoogleReviewsConfig from '@/components/products/GoogleReviewsConfig';

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile } = useUser();
  const fileInputRef = useRef(null);

  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [socialLinks, setSocialLinks] = useState(profile?.social_links || {});

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setUsername(profile.username || '');
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatar_url || '');
      setSocialLinks(profile.social_links || {});
    }
  }, [profile]);

  function handleSocialLinkChange(platform, val) {
    setSocialLinks((prev) => ({
      ...prev,
      [platform]: val,
    }));
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WebP)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be less than 2MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const freshUrl = `${publicUrl}?t=${Date.now()}`;
      setAvatarUrl(freshUrl);

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_url: freshUrl }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save avatar URL to profile');
      }

      router.refresh();
      setMessage('Avatar updated successfully!');
    } catch (err) {
      setError(err.message || 'Avatar upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const cleanUsername = normalizeUsername(username);
    const userVal = validateUsername(cleanUsername);
    if (!userVal.valid) {
      setError(userVal.error);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: displayName.trim(),
          username: cleanUsername,
          bio: bio.trim(),
          avatar_url: avatarUrl,
          social_links: socialLinks,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      router.refresh();
      setMessage('Profile settings saved successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 text-slate-900">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Profile Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Update your public profile, bio, avatar, username, and social accounts.
        </p>
      </div>

      <div className="p-8 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-6">
        {message && (
          <div className="p-3.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 font-medium">
            <CheckCircle2 size={16} /> {message}
          </div>
        )}

        {error && (
          <div className="p-3.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-2xl font-medium">
            {error}
          </div>
        )}

        {/* Avatar Upload Section */}
        <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
          <Avatar
            src={avatarUrl}
            alt={displayName || username}
            size={80}
            className="shadow-card"
          />
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">Profile Photo</h3>
            <p className="text-xs text-slate-500">PNG, JPG or WebP (max. 2MB)</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              loading={uploading}
              className="shadow-soft hover:shadow-card"
            >
              <Upload size={14} /> Upload Image
            </Button>
          </div>
        </div>

        {/* Profile Info Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="username"
            label="Username"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            leadingIcon={AtSign}
            hint="This is your unique URL slug: linknest.app/username"
            required
          />

          <Input
            id="displayName"
            label="Display Name"
            placeholder="Your Name or Brand"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            leadingIcon={User}
          />

          <div className="space-y-1.5">
            <label htmlFor="bio" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <FileText size={14} /> Bio
            </label>
            <textarea
              id="bio"
              rows={3}
              placeholder="Tell visitors a little about yourself or what you make..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 shadow-xs"
            />
            <p className="text-xs text-slate-400">Max 160 characters</p>
          </div>

          {/* Social Links Section */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Social Links</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Add your social media URLs or handles to display minimalist icons on your profile.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                id="social-instagram"
                label="Instagram"
                placeholder="https://instagram.com/username"
                value={socialLinks.instagram || ''}
                onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
              />
              <Input
                id="social-youtube"
                label="YouTube"
                placeholder="https://youtube.com/@channel"
                value={socialLinks.youtube || ''}
                onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
              />
              <Input
                id="social-tiktok"
                label="TikTok"
                placeholder="https://tiktok.com/@username"
                value={socialLinks.tiktok || ''}
                onChange={(e) => handleSocialLinkChange('tiktok', e.target.value)}
              />
              <Input
                id="social-twitter"
                label="Twitter / X"
                placeholder="https://x.com/username"
                value={socialLinks.twitter || ''}
                onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
              />
              <Input
                id="social-facebook"
                label="Facebook"
                placeholder="https://facebook.com/page"
                value={socialLinks.facebook || ''}
                onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
              />
              <Input
                id="social-linkedin"
                label="LinkedIn"
                placeholder="https://linkedin.com/in/profile"
                value={socialLinks.linkedin || ''}
                onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
              />
              <Input
                id="social-whatsapp"
                label="WhatsApp"
                placeholder="+1234567890 (or https://wa.me/...)"
                value={socialLinks.whatsapp || ''}
                onChange={(e) => handleSocialLinkChange('whatsapp', e.target.value)}
              />
              <Input
                id="social-phone"
                label="Phone / Call"
                placeholder="+1234567890 (direct call link)"
                value={socialLinks.phone || ''}
                onChange={(e) => handleSocialLinkChange('phone', e.target.value)}
              />
              <Input
                id="social-github"
                label="GitHub"
                placeholder="https://github.com/username"
                value={socialLinks.github || ''}
                onChange={(e) => handleSocialLinkChange('github', e.target.value)}
              />
              <Input
                id="social-twitch"
                label="Twitch"
                placeholder="https://twitch.tv/username"
                value={socialLinks.twitch || ''}
                onChange={(e) => handleSocialLinkChange('twitch', e.target.value)}
              />
              <Input
                id="social-telegram"
                label="Telegram"
                placeholder="https://t.me/username"
                value={socialLinks.telegram || ''}
                onChange={(e) => handleSocialLinkChange('telegram', e.target.value)}
              />
              <Input
                id="social-email"
                label="Email"
                placeholder="mailto:you@example.com"
                value={socialLinks.email || ''}
                onChange={(e) => handleSocialLinkChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={saving}
              className="shadow-btn hover:shadow-btn-hover"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Google Business Reviews Configuration */}
      <GoogleReviewsConfig profile={profile} />
    </div>
  );
}
