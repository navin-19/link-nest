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
  Package,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Image from 'next/image';
import { isValidProductImageUrl } from '@/utils/isAllowedImageUrl';

const CATEGORY_OPTIONS = [
  'Electronics',
  'Fashion',
  'Beauty',
  'Food & Drink',
  'Toys',
  'Services',
  'Digital',
  'Other',
];

export default function ProductEditorItem({ product, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(product.name);
  const [url, setUrl] = useState(product.url);
  const [price, setPrice] = useState(product.price || '');
  const [description, setDescription] = useState(product.description || '');
  const [category, setCategory] = useState(product.category || '');
  const [customCategory, setCustomCategory] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.6 : 1,
  };

  async function handleSave() {
    if (!name.trim() || !url.trim()) return;
    setSaving(true);
    try {
      const finalCategory = category === 'Other' ? customCategory.trim() : category.trim();
      await onUpdate(product.id, {
        name: name.trim(),
        url: url.trim(),
        price: price.trim() || null,
        description: description.trim() || null,
        category: finalCategory || null,
      });
      setEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive() {
    await onUpdate(product.id, { is_active: !product.is_active });
  }

  async function handleDelete() {
    if (!confirm(`Delete product "${product.name}"?`)) return;
    setDeleting(true);
    try {
      await onDelete(product.id);
    } finally {
      setDeleting(false);
    }
  }

  function handleCancel() {
    setName(product.name);
    setUrl(product.url);
    setPrice(product.price || '');
    setDescription(product.description || '');
    setCategory(product.category || '');
    setCustomCategory('');
    setEditing(false);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        'group flex items-center gap-3 p-4 rounded-2xl border',
        'bg-white dark:bg-[#0c0f1d] transition-all duration-150',
        isDragging
          ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/40 shadow-card'
          : 'border-slate-200/90 dark:border-slate-800 shadow-soft hover:shadow-card hover:border-slate-300 dark:hover:border-slate-700',
        !product.is_active ? 'opacity-60 bg-slate-50/80 dark:bg-slate-900/50' : '',
      ].join(' ')}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="text-slate-300 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-200 cursor-grab active:cursor-grabbing touch-none shrink-0 transition-colors p-1"
        aria-label="Drag to reorder"
      >
        <GripVertical size={18} />
      </button>

      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
        {isValidProductImageUrl(product.image_url) ? (
          <Image
            src={product.image_url}
            alt={product.name || 'Product'}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        ) : (
          <Package size={20} className="text-slate-400 dark:text-slate-500" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2">
                <Input
                  id={`product-name-${product.id}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Product name"
                />
              </div>
              <div>
                <Input
                  id={`product-price-${product.id}`}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price e.g. $19.99"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                id={`product-url-${product.id}`}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                type="url"
              />
              <div className="space-y-1">
                <Select
                  id={`product-category-${product.id}`}
                  placeholder="Select Category..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={CATEGORY_OPTIONS}
                />
                {category === 'Other' && (
                  <Input
                    id={`product-custom-category-${product.id}`}
                    placeholder="Custom category name..."
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="text-xs"
                    autoFocus
                  />
                )}
              </div>
            </div>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] p-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {product.name}
              </p>
              {product.category && (
                <span className="inline-flex items-center text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
              )}
              {product.price && (
                <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded-md">
                  {product.price}
                </span>
              )}
            </div>
            {product.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {product.description}
              </p>
            )}
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono truncate mt-0.5">{product.url}</p>
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
            {product.url && (
              <a
                href={product.url.startsWith('http://') || product.url.startsWith('https://') ? product.url : `https://${product.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                aria-label="Open product link"
                title="View product"
              >
                <ExternalLink size={15} />
              </a>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={handleToggleActive}
              aria-label={product.is_active ? 'Deactivate' : 'Activate'}
              title={product.is_active ? 'Hide product' : 'Show product'}
            >
              {product.is_active ? <Eye size={15} className="text-slate-600 dark:text-slate-300" /> : <EyeOff size={15} className="text-slate-400 dark:text-slate-500" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setEditing(true)}
              aria-label="Edit product"
            >
              <Pencil size={15} className="text-slate-600 dark:text-slate-300" />
            </Button>
            <Button
              size="icon"
              variant="danger"
              onClick={handleDelete}
              loading={deleting}
              aria-label="Delete product"
            >
              <Trash2 size={15} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
