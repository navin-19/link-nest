'use client';

import { useState, useRef } from 'react';
import { Plus, Package, Link2, DollarSign, FileText, Image as ImageIcon, Upload, X, Tag } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { validateUrl } from '@/utils/validators';
import { createClient } from '@/lib/supabaseClient';

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

export default function AddProductForm({ userId, onAdd }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: 'Please select an image (PNG, JPG, WebP)' }));
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Image must be less than 3MB' }));
      return;
    }

    setUploading(true);
    setErrors((prev) => ({ ...prev, image: null }));

    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (err) {
      console.warn('Product image upload failed:', err);
      // If bucket is not yet provisioned on Supabase remote, allow direct image URL or fallback
      setErrors((prev) => ({
        ...prev,
        image: 'Could not upload to storage bucket. You can also paste an image URL directly.',
      }));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});

    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, name: 'Product name is required' }));
      return;
    }

    const urlValidation = validateUrl(url);
    if (!urlValidation.valid) {
      setErrors((prev) => ({ ...prev, url: urlValidation.error }));
      return;
    }

    setLoading(true);
    try {
      const finalCategory = category === 'Other' ? customCategory.trim() : category.trim();
      await onAdd({
        name: name.trim(),
        url: url.trim(),
        price: price.trim() || null,
        description: description.trim() || null,
        image_url: imageUrl || null,
        category: finalCategory || null,
      });

      // Reset form
      setName('');
      setUrl('');
      setPrice('');
      setDescription('');
      setCategory('');
      setCustomCategory('');
      setImageUrl('');
      setIsOpen(false);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to add product' });
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={() => setIsOpen(true)}
        className="py-3.5 shadow-btn hover:shadow-btn-hover flex items-center justify-center gap-2"
      >
        <Plus size={18} />
        Add New Product
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-3xl border border-slate-200/90 bg-white space-y-4 shadow-card animate-slide-down text-slate-900"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Package size={16} className="text-indigo-600" /> Add New Product
        </h3>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setErrors({});
          }}
          className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors"
        >
          Cancel
        </button>
      </div>

      {errors.form && (
        <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl">
          {errors.form}
        </div>
      )}

      {/* Image Upload Row */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 block">
          Product Image
        </label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center relative shrink-0 shadow-2xs">
            {imageUrl ? (
              /* Using <img> for local blob/data preview URLs that cannot be pre-optimized by next/image */
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={26} className="text-slate-400" />
            )}
            {imageUrl && (
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="space-y-2 flex-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                loading={uploading}
                className="text-xs shadow-2xs shrink-0"
              >
                <Upload size={14} /> {imageUrl ? 'Change Image' : 'Upload Image'}
              </Button>
              <span className="text-[11px] text-slate-400">PNG, JPG or WebP (max 3MB)</span>
            </div>
            
            {/* Direct image URL input fallback */}
            <div>
              <Input
                id="product-image-url"
                placeholder="Or paste an image URL (https://...)"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  if (errors.image) setErrors((prev) => ({ ...prev, image: null }));
                }}
                className="text-xs py-2"
              />
            </div>
          </div>
        </div>
        {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <Input
            id="product-name"
            label="Product Name"
            placeholder="e.g. 2026 Notion Planner / E-book"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            leadingIcon={Package}
            required
          />
        </div>
        <div>
          <Input
            id="product-price"
            label="Price (Display)"
            placeholder="e.g. $19.99"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            leadingIcon={DollarSign}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          id="product-url"
          label="Buy / View Link URL"
          placeholder="https://yourstore.com/item"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          error={errors.url}
          leadingIcon={Link2}
          type="url"
          required
        />

        <div className="space-y-2">
          <Select
            id="product-category"
            label="Category (Optional)"
            placeholder="Select a category..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={CATEGORY_OPTIONS}
            leadingIcon={Tag}
          />
          {category === 'Other' && (
            <Input
              id="product-custom-category"
              placeholder="Enter custom category name..."
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="text-xs"
              autoFocus
            />
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="product-desc" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <FileText size={14} /> Short Description (Optional)
        </label>
        <textarea
          id="product-desc"
          rows={2}
          placeholder="A quick 1-2 sentence overview of what makes this product great..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 shadow-xs"
        />
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
          Save Product
        </Button>
      </div>
    </form>
  );
}
