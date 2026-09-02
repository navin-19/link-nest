'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Heading from '@/components/ui/Heading';
import Avatar from '@/components/profile/Avatar';
import {
  resolveCustomerFormConfig,
  DEFAULT_CUSTOMER_FIELDS,
} from '@/utils/customerFormConfig';
import {
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  User,
  Users,
  Mail,
  Phone,
  MapPin,
  FileText,
  Eye,
  Sliders,
  Check,
} from 'lucide-react';

export default function CustomerFormSettings({ profile }) {
  const router = useRouter();
  const initialConfig = useMemo(
    () => resolveCustomerFormConfig(profile?.customer_form_config),
    [profile?.customer_form_config]
  );

  const [enabled, setEnabled] = useState(initialConfig.enabled);
  const [title, setTitle] = useState(initialConfig.title);
  const [description, setDescription] = useState(initialConfig.description);
  const [submitButtonText, setSubmitButtonText] = useState(initialConfig.submitButtonText);
  const [successMessage, setSuccessMessage] = useState(initialConfig.successMessage);
  const [fields, setFields] = useState(initialConfig.fields);

  // New Custom Field modal/drawer state
  const [isAddingField, setIsAddingField] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldOptions, setNewFieldOptions] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Helper to get field icon
  function getFieldIcon(type, key) {
    if (key === 'email' || type === 'email') return Mail;
    if (key === 'mobile_number' || type === 'phone') return Phone;
    if (key === 'place' || key === 'address') return MapPin;
    if (type === 'textarea') return FileText;
    return User;
  }

  // Field updates
  function toggleFieldEnabled(index) {
    setFields((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], enabled: !next[index].enabled };
      return next;
    });
  }

  function toggleFieldRequired(index) {
    setFields((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], required: !next[index].required };
      return next;
    });
  }

  function updateFieldLabel(index, newLabel) {
    setFields((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], label: newLabel };
      return next;
    });
  }

  function updateFieldPlaceholder(index, newPlaceholder) {
    setFields((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], placeholder: newPlaceholder };
      return next;
    });
  }

  function moveField(index, direction) {
    setFields((prev) => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  }

  function removeField(index) {
    setFields((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAddCustomField(e) {
    e.preventDefault();
    if (!newFieldLabel.trim()) return;

    const key =
      'custom_' +
      newFieldLabel
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .slice(0, 24) +
      '_' +
      Date.now().toString().slice(-4);

    const optionsArray =
      newFieldType === 'dropdown'
        ? newFieldOptions
            .split(',')
            .map((o) => o.trim())
            .filter(Boolean)
        : undefined;

    const newField = {
      id: key,
      key,
      label: newFieldLabel.trim(),
      placeholder: newFieldPlaceholder.trim() || 'Enter ' + newFieldLabel.trim(),
      type: newFieldType,
      required: newFieldRequired,
      enabled: true,
      isSystem: false,
      options: optionsArray && optionsArray.length > 0 ? optionsArray : undefined,
    };

    setFields((prev) => [...prev, newField]);
    setNewFieldLabel('');
    setNewFieldPlaceholder('');
    setNewFieldType('text');
    setNewFieldRequired(false);
    setNewFieldOptions('');
    setIsAddingField(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const configPayload = {
        enabled,
        title: title.trim(),
        description: description.trim(),
        submitButtonText: submitButtonText.trim(),
        successMessage: successMessage.trim(),
        fields,
      };

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_form_config: configPayload }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save customer form configuration.');
      }

      setSaveSuccess(true);
      router.refresh();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save customer form settings.');
    } finally {
      setSaving(false);
    }
  }

  const enabledFields = fields.filter((f) => f.enabled);

  return (
    <div className="space-y-8 animate-in fade-in duration-150 text-slate-900 dark:text-slate-100">
      {/* Header Notification Feedback */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Customer form configuration saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs font-medium flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Form Settings (Left) + Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Configuration Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Master Enable/Disable Toggle Card */}
          <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Heading as="h3" className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders size={18} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Customer Subscribe Form</span>
                </Heading>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Allow visitors to subscribe and share their details with you from your public profile.
                </p>
              </div>

              {/* Master Switch */}
              <button
                type="button"
                onClick={() => setEnabled(!enabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                role="switch"
                aria-checked={enabled}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                View submitted visitor contacts and responses in Leads.
              </span>
              <Link
                href="/dashboard/leads"
                className="inline-flex items-center gap-1.5 font-bold text-[11px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors shrink-0"
              >
                <Users size={13} />
                <span>View Submitted Leads</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Form Content & Copy Section */}
          <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-4">
            <Heading as="h4" className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-slate-400 dark:text-slate-500">
              Form Content & Messaging
            </Heading>

            {/* Form Title */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Form Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Subscribe for Updates, Stay Connected"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Form Description */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Form Description / Instructions
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Stay in the loop with our latest deals and announcements."
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Submit Button Text */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Submit Button Text
              </label>
              <input
                type="text"
                value={submitButtonText}
                onChange={(e) => setSubmitButtonText(e.target.value)}
                placeholder="e.g. Subscribe & Connect, Join Now"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Success Message */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Success Confirmation Message
              </label>
              <input
                type="text"
                value={successMessage}
                onChange={(e) => setSuccessMessage(e.target.value)}
                placeholder="e.g. Thank you! We will contact you shortly."
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Customer Fields Management */}
          <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Customer Fields
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select which fields to collect, customize labels & placeholders, and reorder.
                </p>
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsAddingField(true)}
                className="text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Custom Field</span>
              </Button>
            </div>

            {/* Fields List */}
            <div className="space-y-3 pt-2">
              {fields.map((field, index) => {
                const Icon = getFieldIcon(field.type, field.key);
                return (
                  <div
                    key={field.id || field.key || index}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      field.enabled
                        ? 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 shadow-2xs'
                        : 'border-slate-200/60 dark:border-slate-800/40 opacity-60 bg-transparent'
                    }`}
                  >
                    {/* Top Row: Enable, Label, Required, Reorder & Delete */}
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Enabled Checkbox Pill */}
                        <button
                          type="button"
                          onClick={() => toggleFieldEnabled(index)}
                          className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                            field.enabled
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-transparent'
                          }`}
                          title={field.enabled ? 'Disable field' : 'Enable field'}
                        >
                          <Check size={12} strokeWidth={3} />
                        </button>

                        <div className="flex items-center gap-1.5 min-w-0">
                          <Icon size={14} className="text-slate-400 shrink-0" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {field.label}
                          </span>
                          {!field.isSystem && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold uppercase">
                              Custom ({field.type})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right controls: Required Pill + Reorder Arrows + Delete */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {field.enabled && (
                          <button
                            type="button"
                            onClick={() => toggleFieldRequired(index)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${
                              field.required
                                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}
                            title="Toggle required status"
                          >
                            {field.required ? 'Required' : 'Optional'}
                          </button>
                        )}

                        {/* Move Up */}
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveField(index, 'up')}
                          className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-30 transition-colors"
                          title="Move up"
                        >
                          <ArrowUp size={13} />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={index === fields.length - 1}
                          onClick={() => moveField(index, 'down')}
                          className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-30 transition-colors"
                          title="Move down"
                        >
                          <ArrowDown size={13} />
                        </button>

                        {/* Delete Custom Field */}
                        {!field.isSystem && (
                          <button
                            type="button"
                            onClick={() => removeField(index)}
                            className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500 transition-colors"
                            title="Delete custom field"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Bottom Row: Editable Label & Editable Placeholder */}
                    {field.enabled && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                        <div>
                          <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
                            Custom Label
                          </label>
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => updateFieldLabel(index, e.target.value)}
                            className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] px-2.5 py-1.5 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                            placeholder="Field Label"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
                            Custom Placeholder
                          </label>
                          <input
                            type="text"
                            value={field.placeholder || ''}
                            onChange={(e) => updateFieldPlaceholder(index, e.target.value)}
                            className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] px-2.5 py-1.5 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                            placeholder="Placeholder text"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Custom Field Inline Modal / Drawer */}
            {isAddingField && (
              <form
                onSubmit={handleAddCustomField}
                className="p-4 rounded-2xl border-2 border-dashed border-emerald-500/40 bg-emerald-500/5 space-y-3 animate-in fade-in"
              >
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Plus size={14} className="text-emerald-500" />
                    <span>Create Custom Field</span>
                  </h5>
                  <button
                    type="button"
                    onClick={() => setIsAddingField(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Field Label *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Business Type, Order ID"
                      value={newFieldLabel}
                      onChange={(e) => setNewFieldLabel(e.target.value)}
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Field Type
                    </label>
                    <select
                      value={newFieldType}
                      onChange={(e) => setNewFieldType(e.target.value)}
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] px-3 py-2"
                    >
                      <option value="text">Text (Single Line)</option>
                      <option value="textarea">Textarea (Multi-line)</option>
                      <option value="number">Number</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone / WhatsApp</option>
                      <option value="dropdown">Dropdown (Select Option)</option>
                      <option value="date">Date</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Select or type..."
                    value={newFieldPlaceholder}
                    onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] px-3 py-2"
                  />
                </div>

                {newFieldType === 'dropdown' && (
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Dropdown Options (comma-separated) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. New Customer, Existing Customer, Partner"
                      value={newFieldOptions}
                      onChange={(e) => setNewFieldOptions(e.target.value)}
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] px-3 py-2"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newFieldRequired}
                      onChange={(e) => setNewFieldRequired(e.target.checked)}
                      className="rounded text-emerald-500"
                    />
                    <span>Make this field required</span>
                  </label>

                  <Button type="submit" variant="primary" size="sm">
                    Add Field
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Action Save Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="primary"
              size="md"
              loading={saving}
              onClick={handleSave}
              className="shadow-btn hover:shadow-btn-hover"
            >
              Save Customer Form
            </Button>
          </div>
        </div>

        {/* Right Column: Interactive Live Preview Container */}
        <div className="lg:col-span-5 sticky top-6 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Eye size={14} />
              <span>Live Form Preview</span>
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                enabled
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                  : 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
              }`}
            >
              {enabled ? 'Active' : 'Disabled'}
            </span>
          </div>

          {/* Device Mockup Container */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-xl p-5 text-slate-900 dark:text-white space-y-4">
            {/* Header Profile Badge */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <Avatar
                src={profile?.avatar_url}
                alt={profile?.display_name || profile?.username}
                size={46}
                className="shadow-xs shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-bold truncate">
                  {profile?.display_name || `@${profile?.username || 'user'}`}
                </h4>
                <p className="text-[11px] text-slate-400 font-mono truncate">
                  @{profile?.username || 'user'}
                </p>
              </div>
            </div>

            {/* Form Title & Description */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {title || 'Subscribe for Updates'}
                </h3>
              </div>
              {description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Rendered Preview Fields */}
            <div className="space-y-3 pt-1">
              {enabledFields.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 italic rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  No fields enabled. Enable fields on the left.
                </div>
              ) : (
                enabledFields.map((field) => (
                  <div key={field.id || field.key} className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </span>
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        disabled
                        rows={2}
                        placeholder={field.placeholder}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs px-3 py-2 cursor-not-allowed opacity-80"
                      />
                    ) : field.type === 'dropdown' ? (
                      <select
                        disabled
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs px-3 py-2 cursor-not-allowed opacity-80"
                      >
                        <option value="">{field.placeholder || 'Select option...'}</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type === 'phone' ? 'tel' : field.type}
                        disabled
                        placeholder={field.placeholder}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs px-3 py-2 cursor-not-allowed opacity-80"
                      />
                    )}
                  </div>
                ))
              )}

              {/* Submit Button Preview */}
              <div className="pt-2">
                <div className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-emerald-500 text-white font-bold text-xs text-center shadow-btn select-none">
                  {submitButtonText || 'Subscribe & Connect'}
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1 text-center">
                <ShieldCheck size={12} />
                <span>Protected by Google reCAPTCHA bot defense</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
