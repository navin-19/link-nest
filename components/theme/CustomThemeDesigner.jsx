'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Type,
  Square,
  Lock,
  Star,
  Layers,
  Palette,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import BackgroundPicker from './BackgroundPicker';
import PresetThemes from './PresetThemes';
import AvatarFramePicker from './AvatarFramePicker';

// ── Feature Flag: Set to true once billing/subscriptions are live ─────────────
const FONT_STYLE_PRO_GATED = false;

const BUTTON_STYLES = [
  { id: 'rounded',       label: 'Soft Rounded',    desc: 'Sleek white card with gentle shadow' },
  { id: 'filled',        label: 'Solid Charcoal',  desc: 'High-contrast bold solid fill' },
  { id: 'outline',       label: 'Minimal Outline', desc: 'Subtle clean border lines' },
  { id: 'shadow',        label: 'Elevated Floating',desc: 'Deep floating drop shadow' },
  { id: 'glassmorphism', label: 'Glassmorphism',   desc: 'Translucent frosted glass blur' },
  { id: 'hardshadow',    label: 'Hard Shadow',     desc: 'Bold retro pop offset shadow' },
];

const TRENDING_FONTS = [
  { id: 'Poppins',          name: 'Poppins',          desc: 'Geometric Modern' },
  { id: 'Space Grotesk',    name: 'Space Grotesk',    desc: 'Tech & Bold' },
  { id: 'DM Sans',          name: 'DM Sans',          desc: 'Clean Editorial' },
  { id: 'Sora',             name: 'Sora',             desc: 'Futuristic Sharp' },
  { id: 'Playfair Display', name: 'Playfair Display', desc: 'Elegant Serif' },
  { id: 'Inter',            name: 'Inter',            desc: 'Balanced Sans' },
  { id: 'Outfit',           name: 'Outfit',           desc: 'Contemporary Round' },
  { id: 'Roboto',           name: 'Roboto',           desc: 'Classic Sans' },
];

export default function CustomThemeDesigner({
  currentTheme,
  themes = [],
  activeThemeId,
  userPlan = 'free',
  profile,
  onCreateCustomTheme,
  onSelectTheme,
  setPreviewTheme,
  onLocalProfileChange,
}) {
  const isPro = userPlan === 'pro';

  const [customBg, setCustomBg] = useState(
    currentTheme?.background || { type: 'solid', value: '#ffffff' }
  );
  const [customButtonStyle, setCustomButtonStyle] = useState(
    currentTheme?.button_style || 'rounded'
  );
  const [customFont, setCustomFont] = useState(
    currentTheme?.font || 'Inter'
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (currentTheme) {
      if (currentTheme.background) setCustomBg(currentTheme.background);
      if (currentTheme.button_style) setCustomButtonStyle(currentTheme.button_style);
      if (currentTheme.font) setCustomFont(currentTheme.font);
    }
  }, [currentTheme]);

  function handleBgChange(bg) {
    setCustomBg(bg);
    if (setPreviewTheme) {
      setPreviewTheme((prev) => ({
        ...prev,
        background: bg,
        button_style: customButtonStyle,
        font: customFont,
      }));
    }
  }

  function handleButtonStyleChange(styleId) {
    setCustomButtonStyle(styleId);
    if (setPreviewTheme) {
      setPreviewTheme((prev) => ({
        ...prev,
        background: customBg,
        button_style: styleId,
        font: customFont,
      }));
    }
  }

  function handleFontChange(fontId) {
    if (FONT_STYLE_PRO_GATED && !isPro) {
      setError('Custom font selection is a Pro feature. Please upgrade your plan to unlock.');
      return;
    }
    setCustomFont(fontId);
    if (setPreviewTheme) {
      setPreviewTheme((prev) => ({
        ...prev,
        background: customBg,
        button_style: customButtonStyle,
        font: fontId,
      }));
    }
  }

  async function handleSaveCustom() {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const created = await onCreateCustomTheme({
        name: 'My Custom Theme',
        background: customBg,
        button_style: customButtonStyle,
        font: customFont,
      });
      if (created) {
        await onSelectTheme(created.id);
        if (setPreviewTheme) setPreviewTheme(created);
        setSuccess('Custom theme applied successfully!');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to apply custom theme');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 text-slate-900 animate-in fade-in duration-150">
      {/* ── 1. Profile Avatar (Style / Frame) ────────────────────────────── */}
      <AvatarFramePicker
        currentLayout={profile?.avatar_layout || 'classic'}
        userPlan={userPlan}
        onSelectLayout={(layoutId) => {
          if (onLocalProfileChange) {
            onLocalProfileChange({ avatar_layout: layoutId });
          }
        }}
      />

      {/* ── 2. Font Style (Pro-gated, scoped to link cards only) ──────────── */}
      <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Type size={18} className="text-indigo-600" /> 2. Font Style
              </h3>
              {FONT_STYLE_PRO_GATED && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 shadow-2xs">
                  <Star size={12} className="fill-amber-500 text-amber-500" /> Pro
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select trending typography for your link card buttons (profile title font stays independent).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {TRENDING_FONTS.map((f) => {
            const isSelected = customFont === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => handleFontChange(f.id)}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50 shadow-soft ring-2 ring-slate-900/10'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                }`}
              >
                <span
                  className="text-xs font-bold text-slate-900 block truncate"
                  style={{ fontFamily: f.id }}
                >
                  {f.name}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{f.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. Theme (Preset + Custom Color/Gradient/Image Background) ───── */}
      <div className="space-y-6">
        {/* Preset Themes Grid */}
        <PresetThemes
          themes={themes}
          activeThemeId={activeThemeId}
          onSelectTheme={onSelectTheme}
          setPreviewTheme={setPreviewTheme}
        />

        {/* Custom Background Controls */}
        <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Palette size={18} className="text-indigo-600" /> 3. Custom Background
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize with solid colors, dual-stop gradients, uploaded images, or image URLs.
              </p>
            </div>
          </div>

          <BackgroundPicker value={customBg} onChange={handleBgChange} />
        </div>
      </div>

      {/* ── 4. Link Card Design ──────────────────────────────────────────── */}
      <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Square size={18} className="text-indigo-600" /> 4. Link Card Design
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose the card border radius, background fill, elevation, and tactile shadow styling.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {BUTTON_STYLES.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => handleButtonStyleChange(b.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                customButtonStyle === b.id
                  ? 'border-slate-900 bg-slate-50 shadow-soft ring-2 ring-slate-900/10'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="text-xs font-bold text-slate-900">{b.label}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{b.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Notifications & Save Button */}
      {success && (
        <div className="p-3.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 font-medium">
          <CheckCircle2 size={16} className="shrink-0" /> {success}
        </div>
      )}

      {error && (
        <div className="p-3.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 font-medium">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleSaveCustom}
          loading={saving}
          className="shadow-btn hover:shadow-btn-hover text-xs font-bold px-6 py-3"
        >
          Save & Apply Custom Theme
        </Button>
      </div>
    </div>
  );
}
