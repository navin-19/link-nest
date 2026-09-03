'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Sparkles,
  Globe,
  FileText,
} from 'lucide-react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Avatar from '@/components/profile/Avatar';
import { resolveCustomerFormConfig } from '@/utils/customerFormConfig';

const COUNTRY_CODES = [
  { code: '+1', flag: '🇺🇸', name: 'US / Canada' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+55', flag: '🇧🇷', name: 'Brazil' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+27', flag: '🇿🇦', name: 'South Africa' },
  { code: '+63', flag: '🇵🇭', name: 'Philippines' },
  { code: '+60', flag: '🇲🇾', name: 'Malaysia' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
];

const DEFAULT_GENDER_OPTIONS = [
  'Male',
  'Female',
  'Non-binary',
  'Other',
  'Prefer not to say',
];

export default function CustomerFormClient({
  isOpen,
  onClose,
  profile,
  formConfig: customFormConfig,
  username,
  preview = false,
  contrastMode = 'dark',
  font,
  buttonStyle = 'rounded',
}) {
  const formConfig = useMemo(() => {
    return customFormConfig || resolveCustomerFormConfig(profile?.customer_form_config);
  }, [customFormConfig, profile?.customer_form_config]);

  const [formData, setFormData] = useState({});
  const [countryCode, setCountryCode] = useState('+1');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const modalRef = useRef(null);
  const isLight = contrastMode === 'light';
  const customFontStyle = font ? { fontFamily: font } : {};

  // Enabled fields from configuration
  const enabledFields = useMemo(() => {
    if (!formConfig || !Array.isArray(formConfig.fields)) return [];
    return formConfig.fields.filter((f) => f && f.enabled !== false);
  }, [formConfig]);

  // Safe defaults
  const title = formConfig?.title || 'Contact & Subscribe Form';
  const description =
    formConfig?.description !== undefined
      ? formConfig.description
      : 'Fill out the form below';
  const submitButtonText = formConfig?.submitButtonText || 'Subscribe & Connect';
  const successMessage =
    formConfig?.successMessage || 'Thank you! Your contact details have been shared.';

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        handleClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    if (!preview) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (!preview) {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, preview]);

  function handleClose() {
    onClose?.();
    setTimeout(() => {
      setSubmitted(false);
      setError(null);
    }, 200);
  }

  function handleFieldChange(fieldKey, value) {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // Client-side validation of required fields
    for (const field of enabledFields) {
      const fieldKey = field.key || field.id;
      if (field.required) {
        const val = formData[fieldKey];
        if (val === undefined || val === null || String(val).trim() === '') {
          setError(`Please fill in required field: ${field.label || fieldKey}`);
          return;
        }
      }
      if (field.type === 'email' || fieldKey === 'email') {
        const emailVal = formData[fieldKey];
        if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(emailVal).trim())) {
          setError('Please enter a valid email address.');
          return;
        }
      }
    }

    setLoading(true);

    try {
      let captchaToken = null;
      if (
        typeof window !== 'undefined' &&
        window.grecaptcha &&
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
      ) {
        try {
          captchaToken = await new Promise((resolve) => {
            window.grecaptcha.ready(() => {
              window.grecaptcha
                .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'subscribe' })
                .then(resolve)
                .catch(() => resolve(null));
            });
          });
        } catch {
          captchaToken = null;
        }
      }

      // Format mobile number with country code if provided
      const rawMobile = formData.mobile_number || formData.mobile || formData.phone;
      const formattedMobile = rawMobile
        ? `${countryCode} ${String(rawMobile).trim()}`
        : undefined;

      const payload = {
        profileId: profile?.id,
        username: username || profile?.username,
        email: formData.email ? String(formData.email).trim().toLowerCase() : undefined,
        name: formData.name || formData.full_name ? String(formData.name || formData.full_name).trim() : undefined,
        phone: formattedMobile,
        source: 'customer_form',
        custom_data: formData,
        captchaToken,
      };

      if (formData.place) {
        payload.place = String(formData.place).trim();
      }
      if (formData.company || formData.company_name) {
        payload.company_name = String(formData.company || formData.company_name).trim();
      }
      if (formData.gender) {
        payload.gender = String(formData.gender);
      }
      if (formData.dob) {
        payload.dob = String(formData.dob);
      }
      if (formData.website) {
        payload.website = String(formData.website).trim();
      }

      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit form. Please try again.');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  const displayName = profile?.display_name || username || 'Creator';

  // Helper to get leading icon for standard field keys
  function getFieldIcon(field) {
    const key = field.key || field.id;
    const type = field.type;
    if (key === 'name' || key === 'full_name') return User;
    if (key === 'email' || type === 'email') return Mail;
    if (key === 'mobile_number' || key === 'mobile' || type === 'phone') return Phone;
    if (key === 'place') return MapPin;
    if (key === 'company' || key === 'company_name') return Building;
    if (key === 'dob' || type === 'date') return Calendar;
    if (key === 'website') return Globe;
    if (type === 'textarea') return FileText;
    return undefined;
  }

  return (
    <div
      className={`${
        preview ? 'absolute rounded-[36px]' : 'fixed'
      } inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs select-none`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-form-title"
    >
      <div
        ref={modalRef}
        style={customFontStyle}
        className={`w-full max-w-lg rounded-3xl p-5 sm:p-7 space-y-5 max-h-[90%] overflow-y-auto shadow-2xl border transition-all animate-in zoom-in-95 duration-150 relative ${
          isLight
            ? 'bg-white text-slate-900 border-slate-200'
            : 'bg-slate-900 text-white border-slate-700 backdrop-blur-xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top-Right */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close modal"
          className={`absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
        >
          <X size={15} />
        </button>

        {/* Header with Creator Avatar + Title */}
        <div className="flex items-center gap-3.5 pr-8">
          <Avatar
            src={profile?.avatar_url}
            alt={displayName}
            size={46}
            className={`shrink-0 ${isLight ? 'ring-2 ring-slate-900/10' : 'ring-2 ring-white/20'}`}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  isLight
                    ? 'text-slate-700 bg-slate-100 border-slate-200/80'
                    : 'text-white/90 bg-white/10 border-white/15'
                }`}
              >
                CONNECT
              </span>
            </div>
            <h2
              id="customer-form-title"
              className={`text-base sm:text-lg font-extrabold tracking-tight mt-1 truncate ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              {title}
            </h2>
            {description && (
              <p className={`text-xs mt-0.5 line-clamp-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {description}
              </p>
            )}
          </div>
        </div>

        {formConfig.enabled === false ? (
          /* Disabled State */
          <div className="py-8 text-center space-y-3 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Form Currently Unavailable
              </h3>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                This form is currently not accepting new submissions. Please check back later.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        ) : submitted ? (
          /* Confirmation / Success State */
          <div className="py-8 text-center space-y-4 animate-in fade-in duration-200">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto shadow-soft ${
                isLight
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/40'
              }`}
            >
              <CheckCircle2 size={30} />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Details Submitted!
              </h3>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {successMessage}
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className={`px-8 py-2.5 rounded-xl font-bold text-xs shadow-btn hover:shadow-btn-hover transition-all cursor-pointer ${
                  isLight
                    ? 'bg-slate-900 hover:bg-slate-800 text-white'
                    : 'bg-white hover:bg-slate-100 text-slate-950'
                }`}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Dynamic Input Form */
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-2xl animate-in fade-in">
                {error}
              </div>
            )}

            {enabledFields.length === 0 ? (
              <div className={`text-center py-6 text-xs ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                No active fields configured.
              </div>
            ) : (
              <div className="space-y-3">
                {enabledFields.map((field) => {
                  const fieldKey = field.key || field.id;
                  const isRequired = Boolean(field.required);
                  const label = `${field.label || fieldKey}${isRequired ? ' *' : ''}`;
                  const icon = getFieldIcon(field);

                  // 1. Phone / Mobile Field with Country Code Picker
                  if (
                    field.type === 'phone' ||
                    fieldKey === 'mobile_number' ||
                    fieldKey === 'mobile' ||
                    fieldKey === 'phone'
                  ) {
                    return (
                      <div key={field.id || fieldKey} className="space-y-1 text-left">
                        <label className={`text-xs font-semibold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                          {label}
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className={`w-28 rounded-xl border px-2.5 py-2 text-xs font-mono shadow-xs focus:outline-none focus:ring-2 ${
                              isLight
                                ? 'border-slate-200 bg-white text-slate-900 focus:ring-slate-900/10 focus:border-slate-400'
                                : 'border-slate-700 bg-slate-800/90 text-white focus:ring-white/10 focus:border-slate-500'
                            }`}
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option
                                key={c.code + c.name}
                                value={c.code}
                                className={isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}
                              >
                                {c.flag} {c.code}
                              </option>
                            ))}
                          </select>
                          <div className="flex-1">
                            <Input
                              id={`customer-field-${fieldKey}`}
                              type="tel"
                              placeholder={field.placeholder || 'e.g. 555 123 4567'}
                              value={formData[fieldKey] || ''}
                              onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                              leadingIcon={Phone}
                              required={isRequired}
                              contrastMode={contrastMode}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // 2. Textarea Field
                  if (field.type === 'textarea') {
                    return (
                      <Textarea
                        key={field.id || fieldKey}
                        id={`customer-field-${fieldKey}`}
                        label={label}
                        rows={2}
                        placeholder={field.placeholder || 'Enter details...'}
                        value={formData[fieldKey] || ''}
                        onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                        required={isRequired}
                        contrastMode={contrastMode}
                      />
                    );
                  }

                  // 3. Dropdown / Select Field
                  if (field.type === 'dropdown' || field.type === 'select') {
                    const rawOptions = field.options || (fieldKey === 'gender' ? DEFAULT_GENDER_OPTIONS : []);
                    const options = Array.isArray(rawOptions)
                      ? rawOptions
                      : String(rawOptions)
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean);

                    return (
                      <Select
                        key={field.id || fieldKey}
                        id={`customer-field-${fieldKey}`}
                        label={label}
                        placeholder={field.placeholder || 'Select option...'}
                        value={formData[fieldKey] || ''}
                        onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                        options={options}
                        contrastMode={contrastMode}
                      />
                    );
                  }

                  // 4. Checkbox Field
                  if (field.type === 'checkbox') {
                    return (
                      <div key={field.id || fieldKey} className="flex items-center gap-3 pt-1">
                        <input
                          id={`customer-field-${fieldKey}`}
                          type="checkbox"
                          checked={Boolean(formData[fieldKey])}
                          onChange={(e) => handleFieldChange(fieldKey, e.target.checked)}
                          required={isRequired}
                          className={`w-4 h-4 rounded cursor-pointer ${
                            isLight
                              ? 'text-slate-900 focus:ring-slate-900/20 border-slate-300 bg-white'
                              : 'text-emerald-500 focus:ring-emerald-500/20 border-slate-700 bg-slate-800'
                          }`}
                        />
                        <label
                          htmlFor={`customer-field-${fieldKey}`}
                          className={`text-xs font-medium cursor-pointer select-none ${
                            isLight ? 'text-slate-700' : 'text-slate-300'
                          }`}
                        >
                          {label}
                        </label>
                      </div>
                    );
                  }

                  // 5. Default / Text / Email / Date / Number / Website Inputs
                  return (
                    <Input
                      key={field.id || fieldKey}
                      id={`customer-field-${fieldKey}`}
                      type={
                        field.type === 'date'
                          ? 'date'
                          : field.type === 'email'
                          ? 'email'
                          : field.type === 'number'
                          ? 'number'
                          : field.type === 'url'
                          ? 'url'
                          : 'text'
                      }
                      label={label}
                      placeholder={field.placeholder || ''}
                      value={formData[fieldKey] || ''}
                      onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                      leadingIcon={icon}
                      required={isRequired}
                      contrastMode={contrastMode}
                    />
                  );
                })}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-5 rounded-xl font-bold text-xs sm:text-sm shadow-btn hover:shadow-btn-hover transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                } ${
                  isLight
                    ? 'bg-slate-900 hover:bg-slate-800 text-white'
                    : 'bg-white hover:bg-slate-100 text-slate-950 font-bold'
                }`}
              >
                {loading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                ) : (
                  <Sparkles size={15} />
                )}
                <span>{submitButtonText}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
