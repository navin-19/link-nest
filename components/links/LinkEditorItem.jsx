'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  ExternalLink,
  Palette,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { resolveLinkIcon } from '@/components/links/resolveLinkIcon';
import { BUTTON_STYLES } from '@/components/links/buttonStyles';

/**
 * LinkEditorItem — draggable, editable link row with light theme styling, brand icon,
 * and individual card style customization modal.
 */
export default function LinkEditorItem({ link, onUpdate, onDelete }) {
  const [editing, setEditing]                   = useState(false);
  const [title, setTitle]                       = useState(link.title);
  const [url, setUrl]                           = useState(link.url);
  const [saving, setSaving]                     = useState(false);
  const [deleting, setDeleting]                 = useState(false);
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);

  const { Icon } = resolveLinkIcon(link);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.6 : 1,
  };

  const customStyleId = link.custom_style?.buttonStyle;
  const hasCustomStyle = Boolean(customStyleId);
  const selectedStyleObj = BUTTON_STYLES.find((s) => s.id === customStyleId);

  async function handleSave() {
    if (!title.trim() || !url.trim()) return;
    setSaving(true);
    try {
      await onUpdate(link.id, { title: title.trim(), url: url.trim() });
      setEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive() {
    await onUpdate(link.id, { is_active: !link.is_active });
  }

  async function handleDelete() {
    if (!confirm('Delete this link?')) return;
    setDeleting(true);
    try {
      await onDelete(link.id);
    } finally {
      setDeleting(false);
    }
  }

  function handleCancel() {
    setTitle(link.title);
    setUrl(link.url);
    setEditing(false);
  }

  async function handleSelectCustomStyle(styleId) {
    try {
      if (!styleId) {
        await onUpdate(link.id, { custom_style: null });
      } else {
        await onUpdate(link.id, { custom_style: { buttonStyle: styleId } });
      }
      setIsStyleModalOpen(false);
    } catch (e) {
      console.error('Failed to update card style:', e);
    }
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={[
          'group flex items-center gap-3 p-4 rounded-2xl border',
          'bg-white transition-all duration-150',
          isDragging
            ? 'border-indigo-400 bg-indigo-50/40 shadow-card'
            : 'border-slate-200/90 shadow-soft hover:shadow-card hover:border-slate-300',
          !link.is_active ? 'opacity-60 bg-slate-50/80' : '',
        ].join(' ')}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-slate-300 hover:text-slate-700 cursor-grab active:cursor-grabbing touch-none shrink-0 transition-colors p-1"
          aria-label="Drag to reorder"
        >
          <GripVertical size={18} />
        </button>

        {/* Brand Icon */}
        <div className="w-8 h-8 flex items-center justify-center shrink-0">
          <Icon size={26} className="shrink-0 drop-shadow-2xs" />
        </div>

        {/* Content */}
        <div
          className={`flex-1 min-w-0 ${!editing ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
          onClick={() => {
            if (!editing) {
              window.open(link.url, '_blank', 'noopener,noreferrer');
            }
          }}
        >
          {editing ? (
            <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
              <Input
                id={`link-title-${link.id}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Link title"
              />
              <Input
                id={`link-url-${link.id}`}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                type="url"
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-slate-900 truncate">{link.title}</p>
                {hasCustomStyle && (
                  <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                    <span>{selectedStyleObj?.label || customStyleId}</span>
                  </span>
                )}
                {!link.is_active && (
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full shrink-0">
                    Hidden from public page
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5 font-mono">{link.url}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {editing ? (
            <>
              <Button size="icon" variant="primary" onClick={handleSave} loading={saving} aria-label="Save" className="shadow-btn">
                <Check size={15} />
              </Button>
              <Button size="icon" variant="ghost" onClick={handleCancel} aria-label="Cancel">
                <X size={15} />
              </Button>
            </>
          ) : (
            <>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all"
                aria-label="Open link"
              >
                <ExternalLink size={15} />
              </a>

              {/* Per-Link Style Customization Button */}
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsStyleModalOpen(true)}
                aria-label="Customize card style"
                title={hasCustomStyle ? `Custom style: ${selectedStyleObj?.label || customStyleId}` : 'Customize card style'}
                className="relative"
              >
                <Palette size={15} className={hasCustomStyle ? 'text-indigo-600' : 'text-slate-600'} />
                {hasCustomStyle && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
                )}
              </Button>

              <Button
                size="icon"
                variant="ghost"
                onClick={handleToggleActive}
                aria-label={link.is_active ? 'Deactivate' : 'Activate'}
                title={link.is_active ? 'Hide link' : 'Show link'}
              >
                {link.is_active ? <Eye size={15} className="text-slate-600" /> : <EyeOff size={15} className="text-slate-400" />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setEditing(true)}
                aria-label="Edit link"
              >
                <Pencil size={15} className="text-slate-600" />
              </Button>
              <Button
                size="icon"
                variant="danger"
                onClick={handleDelete}
                loading={deleting}
                aria-label="Delete link"
              >
                <Trash2 size={15} />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Per-Link Custom Style Modal */}
      <Modal
        isOpen={isStyleModalOpen}
        onClose={() => setIsStyleModalOpen(false)}
        title={`Custom Style — ${link.title}`}
        description="Choose a unique button preset for this card. Other links will continue using your page's global theme style."
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectCustomStyle(null)}
              className="text-xs flex items-center gap-1.5 text-slate-600"
            >
              <RotateCcw size={13} />
              Reset to page theme
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsStyleModalOpen(false)}
            >
              Close
            </Button>
          </div>
        }
      >
        <div className="space-y-4 pt-1">
          {/* Default / Page Theme Option */}
          <button
            type="button"
            onClick={() => handleSelectCustomStyle(null)}
            className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              !hasCustomStyle
                ? 'border-indigo-600 bg-indigo-50/60 shadow-soft ring-2 ring-indigo-600/10'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-600" />
                Use Page Theme (Default)
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Automatically adapts whenever you change your global theme button style.
              </p>
            </div>
            {!hasCustomStyle && (
              <span className="text-[11px] font-bold text-indigo-600 px-2.5 py-1 rounded-full bg-indigo-100/70 shrink-0">
                Active
              </span>
            )}
          </button>

          {/* Grid of Available Presets */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 px-0.5">
              Or Choose Individual Override
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto p-0.5 scrollbar-thin">
              {BUTTON_STYLES.map((b) => {
                const isSelected = customStyleId === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleSelectCustomStyle(b.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-soft ring-2 ring-indigo-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-900">{b.label}</div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{b.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
