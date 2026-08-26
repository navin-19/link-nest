'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical, Pencil, Trash2, Eye, EyeOff, Check, X, ExternalLink,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

/**
 * LinkEditorItem — draggable, editable link row with light theme styling and drop shadow.
 */
export default function LinkEditorItem({ link, onUpdate, onDelete }) {
  const [editing, setEditing]   = useState(false);
  const [title, setTitle]       = useState(link.title);
  const [url, setUrl]           = useState(link.url);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  return (
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
            <p className="text-sm font-semibold text-slate-900 truncate">{link.title}</p>
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
  );
}
