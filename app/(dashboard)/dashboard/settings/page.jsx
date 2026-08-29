'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabaseClient';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Avatar from '@/components/profile/Avatar';
import CustomerFormSettings from '@/components/settings/CustomerFormSettings';
import {
  Upload,
  AtSign,
  User,
  FileText,
  CheckCircle2,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { validateUsername, normalizeUsername } from '@/utils/validators';

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const { user, profile } = useUser();
  const fileInputRef = useRef(null);

  // Active sub-tab state ('profile' | 'customer-form')
  const [activeTab, setActiveTab] = useState(
    tabParam === 'customer-form' || tabParam === 'form' ? 'customer-form' : 'profile'
  );

  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');

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
    }
  }, [profile]);

  useEffect(() => {
    if (tabParam === 'customer-form' || tabParam === 'form') {
      setActiveTab('customer-form');
    }
  }, [tabParam]);

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
    <div className="max-w-5xl mx-auto space-y-6 text-slate-900 dark:text-slate-100 pb-16">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Profile Settings
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
          Manage your digital profile info, username, avatar, and customer subscribe form.
        </p>
      </div>

      {/* Segmented Pill Navigation Tabs */}
      <div className="flex items-center p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 w-full sm:w-fit shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-white dark:bg-[#0c0f1d] text-slate-950 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <User size={14} />
          <span>Profile Information</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('customer-form')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'customer-form'
              ? 'bg-white dark:bg-[#0c0f1d] text-slate-950 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sliders size={14} className="text-emerald-500" />
          <span>Customer Form</span>
        </button>
      </div>

      {/* Tab 1: Profile Information */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-6 animate-in fade-in duration-150">
          {message && (
            <div className="p-3.5 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl flex items-center gap-2 font-medium">
              <CheckCircle2 size={16} /> {message}
            </div>
          )}

          {error && (
            <div className="p-3.5 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-2xl font-medium">
              {error}
            </div>
          )}

          {/* Avatar Upload Section */}
          <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <Avatar
              src={avatarUrl}
              alt={displayName || username}
              size={80}
              className="shadow-card"
            />
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Profile Photo</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG or WebP (max. 2MB)</p>
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
              <label htmlFor="bio" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText size={14} /> Bio
              </label>
              <textarea
                id="bio"
                rows={3}
                placeholder="Tell visitors a little about yourself or what you make..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
              />
              <p className="text-xs text-slate-400 dark:text-slate-500">Max 160 characters</p>
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
      )}

      {/* Tab 2: Customer Form Settings */}
      {activeTab === 'customer-form' && (
        <CustomerFormSettings profile={profile} />
      )}
    </div>
  );
}
