'use client';

import { useState } from 'react';
import {
  Plus,
  Link2,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Globe,
  Star,
  Bookmark,
  ShoppingBag,
  Music,
  Video,
  Heart,
  FileText,
  Eye,
  EyeOff,
  MousePointerClick,
  Sliders,
  Check,
  X,
} from 'lucide-react';
import Heading from '@/components/ui/Heading';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const ICON_OPTIONS = [
  { id: 'globe', label: 'Globe', Icon: Globe },
  { id: 'link', label: 'Link', Icon: Link2 },
  { id: 'external', label: 'External', Icon: ExternalLink },
  { id: 'star', label: 'Star', Icon: Star },
  { id: 'bookmark', label: 'Bookmark', Icon: Bookmark },
  { id: 'shop', label: 'Shop', Icon: ShoppingBag },
  { id: 'music', label: 'Music', Icon: Music },
  { id: 'video', label: 'Video', Icon: Video },
  { id: 'heart', label: 'Heart', Icon: Heart },
  { id: 'document', label: 'Document', Icon: FileText },
];

const BUTTON_STYLE_OPTIONS = [
  { id: 'rounded', label: 'Rounded Pill' },
  { id: 'sharp', label: 'Sharp Rectangle' },
  { id: 'outline', label: 'Clean Outline' },
  { id: 'glass', label: 'Glassmorphism' },
  { id: 'bentogrid', label: 'Bento Grid' },
];

export default function CustomLinksManager({
  links = [],
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  onLocalLinksChange,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('globe');
  const [selectedButtonStyle, setSelectedButtonStyle] = useState('rounded');
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  function resetForm() {
    setTitle('');
    setUrl('');
    setSelectedIcon('globe');
    setSelectedButtonStyle('rounded');
    setIsActive(true);
    setIsAdding(false);
    setEditingLinkId(null);
    setShowCustomizer(false);
    setError(null);
  }

  function handleStartAdd() {
    resetForm();
    setIsAdding(true);
  }

  function handleStartEdit(link) {
    setTitle(link.title || '');
    setUrl(link.url || '');
    setSelectedIcon(link.icon || 'globe');
    setSelectedButtonStyle(link.custom_style?.buttonStyle || 'rounded');
    setIsActive(link.is_active !== false);
    setEditingLinkId(link.id);
    setIsAdding(false);
    setShowCustomizer(Boolean(link.custom_style?.buttonStyle || link.icon));
    setError(null);
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    let trimmedUrl = url.trim();

    if (!trimmedTitle) {
      setError('Please enter a link title.');
      return;
    }

    if (!trimmedUrl) {
      setError('Please enter a destination URL.');
      return;
    }

    // Auto prepend https:// if missing
    if (
      !trimmedUrl.startsWith('http://') &&
      !trimmedUrl.startsWith('https://') &&
      !trimmedUrl.startsWith('mailto:') &&
      !trimmedUrl.startsWith('tel:')
    ) {
      trimmedUrl = `https://${trimmedUrl}`;
    }

    const payload = {
      title: trimmedTitle,
      url: trimmedUrl,
      icon: selectedIcon,
      is_active: isActive,
      custom_style: {
        buttonStyle: selectedButtonStyle,
      },
    };

    setSaving(true);

    try {
      if (editingLinkId) {
        if (onUpdateLink) {
          await onUpdateLink(editingLinkId, payload);
        }
        setMessage('Link updated successfully!');
      } else {
        if (onAddLink) {
          await onAddLink(payload);
        }
        setMessage('Custom link added successfully!');
      }

      resetForm();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('[CustomLinksManager error]', err);
      setError(err.message || 'Failed to save link');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(linkId) {
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

  async function handleToggleActive(link) {
    try {
      const updatedStatus = !link.is_active;
      if (onUpdateLink) {
        await onUpdateLink(link.id, { is_active: updatedStatus });
      }
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  }

  // Render the inline editor card component (used for both "+ Add Link" and "Edit Link")
  const renderInlineEditCard = (isNew = false) => {
    const ActiveIconComp = (ICON_OPTIONS.find((i) => i.id === selectedIcon) || ICON_OPTIONS[0]).Icon;

    return (
      <form
        onSubmit={handleSubmit}
        className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border-2 border-emerald-500/80 shadow-md space-y-4 animate-in fade-in zoom-in-98 duration-150 text-left"
      >
        {/* Card Top Title & Badge */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <ActiveIconComp size={15} />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {isNew ? 'New Link Card' : 'Edit Link Card'}
            </span>
          </div>

          <button
            type="button"
            onClick={resetForm}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Cancel"
          >
            <X size={15} />
          </button>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Link Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. My Website / Portfolio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Destination URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 font-medium"
            />
          </div>
        </div>

        {/* Customization Toggle */}
        <div className="pt-0.5">
          <button
            type="button"
            onClick={() => setShowCustomizer(!showCustomizer)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer"
          >
            <Sliders size={13} />
            <span>{showCustomizer ? 'Hide Customization Options' : 'Customize Style & Icon'}</span>
            {showCustomizer ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        {/* Expandable Customization Options Drawer */}
        {showCustomizer && (
          <div className="space-y-3.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/80 animate-in fade-in">
            {/* Icon Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Select Icon
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {ICON_OPTIONS.map((opt) => {
                  const IconComp = opt.Icon;
                  const isSelected = selectedIcon === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedIcon(opt.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <IconComp size={12} />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Button Style Preset */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Button Style Override
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {BUTTON_STYLE_OPTIONS.map((btn) => {
                  const isSelected = selectedButtonStyle === btn.id;
                  return (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setSelectedButtonStyle(btn.id)}
                      className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs font-bold'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {btn.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Card Action Buttons (Cancel / Save) */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-800/80">
          <button
            type="button"
            onClick={resetForm}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-btn hover:shadow-btn-hover transition-all active:scale-[0.98] cursor-pointer"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Check size={13} strokeWidth={3} />
            )}
            <span>{isNew ? 'Save Link' : 'Update Link'}</span>
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Container Card */}
      <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-6 transition-colors">
        {/* Header with Title & Add Link Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <Heading as="h3" className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Link2 size={13} />
              </div>
              Custom Profile Links
            </Heading>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Add quick custom buttons to your public profile that visitors can tap.
            </p>
          </div>

          {!isAdding && !editingLinkId && (
            <button
              type="button"
              onClick={handleStartAdd}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-btn hover:shadow-btn-hover transition-all active:scale-[0.98] cursor-pointer self-start sm:self-auto shrink-0"
            >
              <Plus size={14} />
              <span>Add Link</span>
            </button>
          )}
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

        {/* Custom Links List Area */}
        <div className="space-y-3">
          {/* If user clicked "+ Add Link", render the new editable card right at the top of the list! */}
          {isAdding && renderInlineEditCard(true)}

          {/* Existing Links List */}
          {links && links.length > 0 ? (
            links.map((link) => {
              // If this specific link is being edited, render the inline editor in its place
              if (editingLinkId === link.id) {
                return <div key={link.id}>{renderInlineEditCard(false)}</div>;
              }

              const matchedIcon = ICON_OPTIONS.find((i) => i.id === link.icon) || ICON_OPTIONS[0];
              const IconComp = matchedIcon.Icon;

              return (
                <div
                  key={link.id}
                  className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
                    link.is_active !== false
                      ? 'bg-white dark:bg-slate-900/40 border-slate-200/90 dark:border-slate-800 hover:border-slate-300'
                      : 'bg-slate-50/50 dark:bg-slate-950/40 border-dashed border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  {/* Left: Icon + Title + URL */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                      <IconComp size={16} />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {link.title}
                        </h5>
                        {link.click_count > 0 && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                            <MousePointerClick size={10} />
                            {link.click_count}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {link.url}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(link)}
                      title={link.is_active !== false ? 'Hide link' : 'Show link'}
                      className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
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
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Edit2 size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(link.id)}
                      title="Delete link"
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : !isAdding ? (
            <div
              onClick={handleStartAdd}
              className="text-center py-8 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-colors cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 flex items-center justify-center mx-auto transition-colors">
                <Plus size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  No custom links added yet
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click here or press <span className="font-semibold text-emerald-500">+ Add Link</span> to create your first button.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
