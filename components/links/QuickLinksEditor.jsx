'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Zap,
  CheckCircle2,
  AlertCircle,
  Info,
  Save,
  Phone,
  Mail,
  Plus,
  GripVertical,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Globe,
  ExternalLink,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/BrandIcons';
import Heading from '@/components/ui/Heading';
import { QUICK_LINK_FIELDS } from './socialLinksHelper';

function QuickLinkSwatch({ platformId, size = 20 }) {
  switch (platformId) {
    case 'whatsapp':
      return (
        <div className="w-8 h-8 rounded-lg bg-[#25D366] flex items-center justify-center text-white shrink-0 shadow-2xs">
          <WhatsAppIcon size={size} />
        </div>
      );
    case 'phone':
      return (
        <div className="w-8 h-8 rounded-lg bg-[#0284C7] flex items-center justify-center text-white shrink-0 shadow-2xs">
          <Phone size={15} />
        </div>
      );
    case 'email':
      return (
        <div className="w-8 h-8 rounded-lg bg-[#EA4335] flex items-center justify-center text-white shrink-0 shadow-2xs">
          <Mail size={15} />
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

export default function QuickLinksEditor({
  profile,
  onLocalProfileChange,
  links = [],
  onAddLink,
  onUpdateLink,
  onDeleteLink,
}) {
  const router = useRouter();
  const [quickLinks, setQuickLinks] = useState(profile?.quick_links || {});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Inline "+ Add Link" state inside the Quick Link List
  const [isAdding, setIsAdding] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [savingNewLink, setSavingNewLink] = useState(false);

  useEffect(() => {
    if (profile?.quick_links) {
      setQuickLinks(profile.quick_links);
    } else if (profile?.social_links) {
      const initial = {};
      if (profile.social_links.whatsapp) initial.whatsapp = profile.social_links.whatsapp;
      if (profile.social_links.phone) initial.phone = profile.social_links.phone;
      if (profile.social_links.email) initial.email = profile.social_links.email;
      if (Object.keys(initial).length > 0) setQuickLinks(initial);
    }
  }, [profile?.quick_links, profile?.social_links]);

  function handleChange(platform, value) {
    const updated = {
      ...quickLinks,
      [platform]: value,
    };
    setQuickLinks(updated);

    if (onLocalProfileChange) {
      onLocalProfileChange({ quick_links: updated });
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
          quick_links: quickLinks,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update quick links');

      router.refresh();
      setMessage('Quick links updated successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('[QuickLinksEditor error]', err);
      setError(err.message || 'Failed to save quick links');
    } finally {
      setSaving(false);
    }
  }

  function handleStartAdd() {
    setNewTitle('');
    setNewUrl('');
    setEditingLinkId(null);
    setIsAdding(true);
  }

  function handleStartEdit(link) {
    setNewTitle(link.title || '');
    setNewUrl(link.url || '');
    setIsAdding(false);
    setEditingLinkId(link.id);
  }

  function handleCancelInline() {
    setNewTitle('');
    setNewUrl('');
    setIsAdding(false);
    setEditingLinkId(null);
  }

  async function handleSaveInlineLink(e) {
    if (e) e.preventDefault();
    const trimmedTitle = newTitle.trim();
    let trimmedUrl = newUrl.trim();

    if (!trimmedTitle) {
      setError('Please enter a link title.');
      return;
    }
    if (!trimmedUrl) {
      setError('Please enter a destination URL.');
      return;
    }

    if (
      !trimmedUrl.startsWith('http://') &&
      !trimmedUrl.startsWith('https://') &&
      !trimmedUrl.startsWith('mailto:') &&
      !trimmedUrl.startsWith('tel:')
    ) {
      trimmedUrl = `https://${trimmedUrl}`;
    }

    setSavingNewLink(true);
    setError(null);

    try {
      if (editingLinkId) {
        if (onUpdateLink) {
          await onUpdateLink(editingLinkId, {
            title: trimmedTitle,
            url: trimmedUrl,
          });
        }
        setMessage('Link updated successfully!');
      } else {
        if (onAddLink) {
          await onAddLink({
            title: trimmedTitle,
            url: trimmedUrl,
            is_active: true,
          });
        }
        setMessage('Quick link added successfully!');
      }

      handleCancelInline();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save link');
    } finally {
      setSavingNewLink(false);
    }
  }

  async function handleDeleteCustomLink(linkId) {
    if (!confirm('Are you sure you want to remove this link?')) return;
    try {
      if (onDeleteLink) {
        await onDeleteLink(linkId);
      }
      setMessage('Link removed.');
      setTimeout(() => setMessage(null), 2500);
    } catch (err) {
      setError(err.message || 'Failed to delete link');
    }
  }

  async function handleToggleCustomLinkActive(link) {
    try {
      if (onUpdateLink) {
        await onUpdateLink(link.id, { is_active: !link.is_active });
      }
    } catch (err) {
      setError(err.message || 'Failed to update visibility');
    }
  }

  // Clear contact item
  function handleClearContact(platformId) {
    handleChange(platformId, '');
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* ── UNIFIED QUICK ACTION LINKS CARD ── */}
      <div className="p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-6 transition-colors text-left">
        {/* Top Header with Title on Left & "+ Add Link" on Right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <Heading as="h3" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Zap size={14} />
              </div>
              Quick Action Links
            </Heading>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage your direct contact buttons displayed in your public profile&apos;s Quick Links popup.
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartAdd}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-btn hover:shadow-btn-hover transition-all active:scale-[0.98] cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Plus size={14} />
            <span>Add Link</span>
          </button>
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

        {/* 1. Contact Form Inputs (WhatsApp, Phone, Email) */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* WhatsApp */}
            <div className="space-y-1.5">
              <label htmlFor="quick-whatsapp" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                WhatsApp
              </label>
              <div className="relative flex items-center rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all p-1.5 gap-2.5">
                <QuickLinkSwatch platformId="whatsapp" />
                <input
                  id="quick-whatsapp"
                  type="text"
                  placeholder="+1234567890 (or https://wa.me/...)"
                  value={quickLinks.whatsapp || ''}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none pr-2"
                />
              </div>
            </div>

            {/* Phone / Direct Call */}
            <div className="space-y-1.5">
              <label htmlFor="quick-phone" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Phone / Direct Call
              </label>
              <div className="relative flex items-center rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all p-1.5 gap-2.5">
                <QuickLinkSwatch platformId="phone" />
                <input
                  id="quick-phone"
                  type="text"
                  placeholder="+1234567890"
                  value={quickLinks.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none pr-2"
                />
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5 sm:w-1/2 sm:pr-2">
            <label htmlFor="quick-email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative flex items-center rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all p-1.5 gap-2.5">
              <QuickLinkSwatch platformId="email" />
              <input
                id="quick-email"
                type="text"
                placeholder="you@example.com"
                value={quickLinks.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none pr-2"
              />
            </div>
          </div>
        </form>

        {/* 2. Middle Divider */}
        <div className="border-t border-slate-200/80 dark:border-slate-800/80" />

        {/* 3. Quick Link List Section */}
        <div className="space-y-3.5">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Quick Link List
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              These links will appear as buttons in your profile&apos;s Quick Links popup.
            </p>
          </div>

          {/* Inline Add / Edit Link Card */}
          {(isAdding || editingLinkId) && (
            <form
              onSubmit={handleSaveInlineLink}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border-2 border-emerald-500/80 shadow-md space-y-3.5 animate-in fade-in"
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/70 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles size={13} className="text-emerald-500" />
                  {isAdding ? 'New Quick Link' : 'Edit Quick Link'}
                </span>
                <button
                  type="button"
                  onClick={handleCancelInline}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Link Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Website"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Destination URL *
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={handleCancelInline}
                  disabled={savingNewLink}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingNewLink}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-btn transition-all active:scale-[0.98]"
                >
                  {savingNewLink ? (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <Check size={13} strokeWidth={3} />
                  )}
                  <span>{isAdding ? 'Save Link' : 'Update Link'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Quick Links Items List */}
          <div className="space-y-2.5">
            {/* Populated WhatsApp Row */}
            {quickLinks.whatsapp && (
              <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-grab shrink-0">
                    <GripVertical size={16} />
                  </div>
                  <QuickLinkSwatch platformId="whatsapp" size={18} />
                  <div className="min-w-0 text-left">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      WhatsApp
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
                      {quickLinks.whatsapp}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById('quick-whatsapp')?.focus();
                    }}
                    title="Edit WhatsApp"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClearContact('whatsapp')}
                    title="Remove WhatsApp"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* Populated Phone Row */}
            {quickLinks.phone && (
              <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-grab shrink-0">
                    <GripVertical size={16} />
                  </div>
                  <QuickLinkSwatch platformId="phone" size={18} />
                  <div className="min-w-0 text-left">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      Phone / Direct Call
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
                      {quickLinks.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById('quick-phone')?.focus();
                    }}
                    title="Edit Phone"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClearContact('phone')}
                    title="Remove Phone"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* Populated Email Row */}
            {quickLinks.email && (
              <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-grab shrink-0">
                    <GripVertical size={16} />
                  </div>
                  <QuickLinkSwatch platformId="email" size={18} />
                  <div className="min-w-0 text-left">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      Email Address
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
                      {quickLinks.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById('quick-email')?.focus();
                    }}
                    title="Edit Email"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClearContact('email')}
                    title="Remove Email"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* Custom Links Rows */}
            {links && links.length > 0 && (
              links.map((link) => {
                if (editingLinkId === link.id) return null; // rendered in inline form

                return (
                  <div
                    key={link.id}
                    className={`flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all ${
                      link.is_active !== false
                        ? 'bg-white dark:bg-slate-900/40 border-slate-200/90 dark:border-slate-800 hover:border-slate-300'
                        : 'bg-slate-50/50 dark:bg-slate-950/40 border-dashed border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-grab shrink-0">
                        <GripVertical size={16} />
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Globe size={15} />
                      </div>
                      <div className="min-w-0 text-left">
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {link.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {link.url}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleCustomLinkActive(link)}
                        title={link.is_active !== false ? 'Hide link' : 'Show link'}
                        className={`p-1.5 rounded-lg border text-xs transition-colors ${
                          link.is_active !== false
                            ? 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            : 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {link.is_active !== false ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStartEdit(link)}
                        title="Edit link"
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCustomLink(link.id)}
                        title="Delete link"
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Empty state if nothing is added */}
            {!quickLinks.whatsapp && !quickLinks.phone && !quickLinks.email && (!links || links.length === 0) && !isAdding && (
              <div
                onClick={handleStartAdd}
                className="text-center py-6 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-colors cursor-pointer space-y-1.5 group"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-emerald-500 flex items-center justify-center mx-auto">
                  <Plus size={16} />
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  No Quick Links Added Yet
                </p>
                <p className="text-[11px] text-slate-400">
                  Fill in your contact details above or click <span className="font-semibold text-emerald-500">+ Add Link</span>.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 4. Footer Note + Save Quick Links Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Info size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Contact buttons appear in your Quick Links modal.</span>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-btn hover:shadow-btn-hover transition-all active:scale-[0.98] cursor-pointer self-end"
          >
            {saving ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Save size={14} />
            )}
            <span>Save Quick Links</span>
          </button>
        </div>
      </div>
    </div>
  );
}
