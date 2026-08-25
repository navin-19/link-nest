'use client';

import { useState } from 'react';
import { Plus, Link2, Type } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { validateUrl, validateLinkTitle } from '@/utils/validators';

export default function AddLinkForm({ onAdd }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});

    const titleValidation = validateLinkTitle(title);
    if (!titleValidation.valid) {
      setErrors((prev) => ({ ...prev, title: titleValidation.error }));
      return;
    }

    const urlValidation = validateUrl(url);
    if (!urlValidation.valid) {
      setErrors((prev) => ({ ...prev, url: urlValidation.error }));
      return;
    }

    setLoading(true);
    try {
      await onAdd({ title: title.trim(), url: url.trim() });
      setTitle('');
      setUrl('');
      setIsOpen(false);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to create link' });
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
        className="py-3.5 shadow-btn hover:shadow-btn-hover"
      >
        <Plus size={18} />
        Add New Link
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-3xl border border-slate-200/90 bg-white space-y-4 shadow-card animate-slide-down text-slate-900"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-sm">Add New Link</h3>
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

      <Input
        id="link-title-input"
        label="Title"
        placeholder="e.g. My Portfolio / Latest Video / Shop"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        leadingIcon={Type}
        required
      />

      <Input
        id="link-url-input"
        label="URL"
        placeholder="https://..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        error={errors.url}
        leadingIcon={Link2}
        type="url"
        required
      />

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
          Save Link
        </Button>
      </div>
    </form>
  );
}
