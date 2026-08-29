'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Avatar from '@/components/profile/Avatar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { resolveCustomerFormConfig } from '@/utils/customerFormConfig';
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  X,
  Building2,
  Calendar,
  Globe,
} from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+1', flag: '🇺🇸', name: 'US / Canada' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
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
  { code: '+62', flag: '🇮🇩', name: 'Indonesia' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+64', flag: '🇳🇿', name: 'New Zealand' },
  { code: '+39', flag: '🇮🇹', name: 'Italy' },
  { code: '+34', flag: '🇪🇸', name: 'Spain' },
  { code: '+52', flag: '🇲🇽', name: 'Mexico' },
  { code: '+41', flag: '🇨🇭', name: 'Switzerland' },
  { code: '+31', flag: '🇳🇱', name: 'Netherlands' },
  { code: '+46', flag: '🇸🇪', name: 'Sweden' },
  { code: '+82', flag: '🇰🇷', name: 'South Korea' },
  { code: '+880', flag: '🇧🇩', name: 'Bangladesh' },
  { code: '+92', flag: '🇵🇰', name: 'Pakistan' },
  { code: '+94', flag: '🇱🇰', name: 'Sri Lanka' },
  { code: '+977', flag: '🇳🇵', name: 'Nepal' },
  { code: '+20', flag: '🇪🇬', name: 'Egypt' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya' },
];

export default function SubscribeFormClient({
  profile,
  username,
  isModal = false,
  onClose,
}) {
  const config = resolveCustomerFormConfig(profile?.customer_form_config);

  // Dynamic form state values
  const [formData, setFormData] = useState({});
  const [countryCode, setCountryCode] = useState('+1');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // Escape key handler for modal
  useEffect(() => {
    if (!isModal) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose?.();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModal, onClose]);

  // Dynamically load Google reCAPTCHA v3 script if siteKey is present
  useEffect(() => {
    if (!siteKey) return;
    const scriptId = 'recaptcha-v3-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      document.head.appendChild(script);
    }
  }, [siteKey]);

  async function getRecaptchaToken() {
    if (!siteKey || typeof window === 'undefined' || !window.grecaptcha) {
      return null;
    }
    return new Promise((resolve) => {
      try {
        window.grecaptcha.ready(async () => {
          try {
            const token = await window.grecaptcha.execute(siteKey, { action: 'subscribe' });
            resolve(token);
          } catch (e) {
            console.warn('[reCAPTCHA] Failed to execute token retrieval:', e);
            resolve(null);
          }
        });
      } catch (e) {
        resolve(null);
      }
    });
  }

  function handleFieldChange(key, value) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Get reCAPTCHA token if configured
      let captchaToken = null;
      if (siteKey) {
        captchaToken = await getRecaptchaToken();
      }

      // 2. Prepare payload matching standard fields and custom data
      const payload = {
        username,
        captchaToken,
        countryCode,
        country_code: countryCode,
        ...formData,
      };

      // Ensure key standard field aliases are populated
      if (formData.name) payload.name = formData.name.trim();
      if (formData.email) payload.email = formData.email.trim().toLowerCase();
      if (formData.mobile_number) payload.mobileNumber = formData.mobile_number.trim();
      if (formData.place) payload.place = formData.place.trim();
      if (formData.address) payload.address = formData.address.trim();

      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit subscription.');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'An error occurred while subscribing. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const enabledFields = config.fields.filter((f) => f.enabled);

  function getFieldIcon(type, key) {
    if (key === 'email' || type === 'email') return Mail;
    if (key === 'mobile_number' || type === 'phone') return Phone;
    if (key === 'place' || key === 'address') return MapPin;
    if (key === 'company') return Building2;
    if (key === 'dob' || type === 'date') return Calendar;
    if (key === 'website') return Globe;
    if (type === 'textarea') return FileText;
    return User;
  }

  const formCardContent = (
    <div className="space-y-6 text-slate-900">
      {/* Creator Profile Header Badge */}
      <div className="flex items-center gap-4 pb-6 border-b border-slate-100 pr-8">
        <Avatar
          src={profile?.avatar_url}
          alt={profile?.display_name || username}
          size={56}
          className="shadow-soft shrink-0"
        />
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900 truncate">
            {profile?.display_name || `@${username}`}
          </h2>
          <p className="text-xs text-slate-500 truncate font-mono">
            @{username}
          </p>
        </div>
      </div>

      {submitted ? (
        /* Success State Confirmation */
        <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle2 size={30} />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-slate-900">
              You&apos;re Subscribed!
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              {config.successMessage || (
                <>
                  Thank you! Your contact details have been shared with{' '}
                  <span className="font-semibold text-slate-900">@{username}</span>. You&apos;ll be notified of new updates and exclusive announcements.
                </>
              )}
            </p>
          </div>

          <div className="pt-4">
            {isModal ? (
              <Button
                type="button"
                variant="primary"
                size="lg"
                fullWidth
                onClick={onClose}
                className="shadow-btn hover:shadow-btn-hover"
              >
                Done
              </Button>
            ) : (
              <Link href={`/${username}`} className="w-full inline-block">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="shadow-btn hover:shadow-btn-hover flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} />
                  <span>Back to @{username}&apos;s Profile</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        /* Dynamic Lead Capture Form */
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles size={18} />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-base font-bold text-slate-900">
                {config.title || 'Subscribe for Updates'}
              </h1>
              {config.description && (
                <p className="text-xs text-slate-500 leading-relaxed">
                  {config.description}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 font-medium">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Dynamically Render All Enabled Fields in Saved Order */}
            {enabledFields.map((field) => {
              const fieldKey = field.key || field.id;
              const Icon = getFieldIcon(field.type, fieldKey);
              const isRequired = Boolean(field.required);
              const labelText = `${field.label || 'Field'} ${isRequired ? '*' : ''}`;

              // 1. Phone Field with Country Code Picker
              if (field.type === 'phone' || fieldKey === 'mobile_number') {
                return (
                  <div key={field.id || fieldKey} className="flex flex-col gap-1.5 text-left">
                    <label htmlFor={`lead-${fieldKey}`} className="text-xs font-semibold text-slate-700">
                      {labelText}
                    </label>
                    <div className="flex gap-2.5">
                      <div className="w-36 shrink-0">
                        <select
                          id={`lead-country-code-${fieldKey}`}
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          aria-label="Country Code"
                          className="w-full rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-900 px-3 py-2.5 text-sm shadow-xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 font-mono cursor-pointer"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code + c.name} value={c.code}>
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex-1 min-w-0">
                        <Input
                          id={`lead-${fieldKey}`}
                          type="tel"
                          placeholder={field.placeholder || '98765 43210'}
                          value={formData[fieldKey] || ''}
                          onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                          leadingIcon={Icon}
                          required={isRequired}
                        />
                      </div>
                    </div>
                  </div>
                );
              }

              // 2. Textarea Field
              if (field.type === 'textarea') {
                return (
                  <div key={field.id || fieldKey} className="flex flex-col gap-1.5 text-left">
                    <label
                      htmlFor={`lead-${fieldKey}`}
                      className="text-xs font-semibold text-slate-700 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1.5">
                        <Icon size={14} /> {labelText}
                      </span>
                      {!isRequired && (
                        <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                      )}
                    </label>
                    <textarea
                      id={`lead-${fieldKey}`}
                      rows={3}
                      placeholder={field.placeholder || ''}
                      value={formData[fieldKey] || ''}
                      onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                      required={isRequired}
                      className="w-full rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 p-3.5 text-sm shadow-xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                    />
                  </div>
                );
              }

              // 3. Dropdown Select Field
              if (field.type === 'dropdown') {
                return (
                  <div key={field.id || fieldKey} className="flex flex-col gap-1.5 text-left">
                    <label htmlFor={`lead-${fieldKey}`} className="text-xs font-semibold text-slate-700">
                      {labelText}
                    </label>
                    <select
                      id={`lead-${fieldKey}`}
                      value={formData[fieldKey] || ''}
                      onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                      required={isRequired}
                      className="w-full rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-900 px-3.5 py-2.5 text-sm shadow-xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 cursor-pointer"
                    >
                      <option value="">{field.placeholder || 'Select an option...'}</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              // 4. Standard Single-line Input Field (text, email, number, date)
              return (
                <Input
                  key={field.id || fieldKey}
                  id={`lead-${fieldKey}`}
                  label={labelText}
                  type={field.type || 'text'}
                  placeholder={field.placeholder || ''}
                  value={formData[fieldKey] || ''}
                  onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                  leadingIcon={Icon}
                  required={isRequired}
                />
              );
            })}

            {/* Submit Action Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                className="shadow-btn hover:shadow-btn-hover text-sm font-semibold py-3"
              >
                {config.submitButtonText || 'Subscribe & Connect'}
              </Button>
            </div>

            {/* reCAPTCHA disclosure */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-1 text-center font-medium">
              <ShieldCheck size={14} className="text-slate-400 shrink-0" />
              <span>Protected by Google reCAPTCHA v3 bot defense</span>
            </div>
          </form>
        </div>
      )}
    </div>
  );

  // If rendering as a modal popup
  if (isModal) {
    return (
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fade-in"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-200/90 bg-white p-8 shadow-2xl animate-scale-up text-slate-900"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer z-10"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {formCardContent}
        </div>
      </div>
    );
  }

  // Full page view wrapper: standard light utility-form style for guaranteed legibility
  return (
    <main className="min-h-screen bg-[#fafaf9] text-slate-900 py-12 px-4 flex flex-col justify-center items-center selection:bg-slate-900 selection:text-white">
      <div className="w-full max-w-lg mx-auto space-y-5">
        {/* Back Link Button */}
        <div>
          <Link
            href={`/${username}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200/90 hover:border-slate-300 px-4 py-2 rounded-full shadow-soft hover:shadow-card transition-all"
          >
            <ArrowLeft size={14} />
            <span>Back to @{username}&apos;s Profile</span>
          </Link>
        </div>

        {/* Lead Capture Card */}
        <div className="p-8 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-6">
          {formCardContent}
        </div>
      </div>
    </main>
  );
}
