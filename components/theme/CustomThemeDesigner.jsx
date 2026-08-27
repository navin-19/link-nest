'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  Loader2,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import BackgroundPicker from './BackgroundPicker';
import PresetThemes from './PresetThemes';
import AvatarFramePicker from './AvatarFramePicker';
import { BUTTON_STYLES } from '@/components/links/buttonStyles';

// ── Feature Flag: Set to true once billing/subscriptions are live ─────────────
const FONT_STYLE_PRO_GATED = false;

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
  onUpdateCustomTheme,
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
  const [autoSaveStatus, setAutoSaveStatus] = useState(null); // null | 'saving' | 'saved'
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (currentTheme) {
      if (currentTheme.background) setCustomBg(currentTheme.background);
      if (currentTheme.button_style) setCustomButtonStyle(currentTheme.button_style);
      if (currentTheme.font) setCustomFont(currentTheme.font);
    }
  }, [currentTheme]);

  // Debounced auto-save handler to ensure edits persist to live public profile automatically
  const saveThemeEdits = useCallback(async (bg, btnStyle, font) => {
    setAutoSaveStatus('saving');
    setError(null);

    try {
      // If currentTheme has a user_id, it is an editable custom theme
      const isCustomUserTheme = Boolean(currentTheme?.id && currentTheme?.user_id);

      if (isCustomUserTheme && onUpdateCustomTheme) {
        const updated = await onUpdateCustomTheme(currentTheme.id, {
          background: bg,
          button_style: btnStyle,
          font: font,
        });
        if (setPreviewTheme) setPreviewTheme(updated);
      } else if (onCreateCustomTheme) {
        // Fork a new custom theme if currently on preset
        const created = await onCreateCustomTheme({
          name: 'My Custom Theme',
          background: bg,
          button_style: btnStyle,
          font: font,
        });
        if (created) {
          if (onSelectTheme) await onSelectTheme(created.id);
          if (setPreviewTheme) setPreviewTheme(created);
        }
      }
      setAutoSaveStatus('saved');
      setTimeout(() => {
        setAutoSaveStatus((prev) => (prev === 'saved' ? null : prev));
      }, 3000);
    } catch (err) {
      console.error('[CustomThemeDesigner auto-save error]', err);
      setAutoSaveStatus(null);
      setError(err.message || 'Failed to auto-save theme changes');
    }
  }, [currentTheme, onUpdateCustomTheme, onCreateCustomTheme, onSelectTheme, setPreviewTheme]);

  const scheduleAutoSave = useCallback((bg, btnStyle, font) => {
    setAutoSaveStatus('saving');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      saveThemeEdits(bg, btnStyle, font);
    }, 500);
  }, [saveThemeEdits]);

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
    scheduleAutoSave(bg, customButtonStyle, customFont);
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
    scheduleAutoSave(customBg, styleId, customFont);
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
    scheduleAutoSave(customBg, customButtonStyle, fontId);
  }

  async function handleSaveCustom() {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const isCustomUserTheme = Boolean(currentTheme?.id && currentTheme?.user_id);

      if (isCustomUserTheme && onUpdateCustomTheme) {
        const updated = await onUpdateCustomTheme(currentTheme.id, {
          background: customBg,
          button_style: customButtonStyle,
          font: customFont,
        });
        if (setPreviewTheme) setPreviewTheme(updated);
        setSuccess('Custom theme saved & applied successfully!');
      } else if (onCreateCustomTheme) {
        const created = await onCreateCustomTheme({
          name: 'My Custom Theme',
          background: customBg,
          button_style: customButtonStyle,
          font: customFont,
        });
        if (created) {
          if (onSelectTheme) await onSelectTheme(created.id);
          if (setPreviewTheme) setPreviewTheme(created);
          setSuccess('Custom theme created & applied successfully!');
        }
      }
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to apply custom theme');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 text-slate-900 animate-in fade-in duration-150">
      {/* Auto-Save & Status Bar */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Theme Customizer
        </span>
        <div>
          {autoSaveStatus === 'saving' && (
            <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-medium animate-pulse">
              <Loader2 size={12} className="animate-spin shrink-0" /> Auto-saving to public profile...
            </span>
          )}
          {autoSaveStatus === 'saved' && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium animate-fade-in">
              <CheckCircle2 size={13} className="shrink-0" /> Auto-saved to live profile
            </span>
          )}
        </div>
      </div>

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

      {/* ── 2. Preset Themes ──────────────────────────────────────────────── */}
      <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-600" /> 2. Preset Themes
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any curated style to instantly refresh your page background, buttons, and font.
            </p>
          </div>
        </div>

        <PresetThemes
          themes={themes}
          activeThemeId={activeThemeId}
          onSelectTheme={onSelectTheme}
          previewTheme={currentTheme}
          setPreviewTheme={setPreviewTheme}
        />
      </div>

      {/* ── 3. Page Background ────────────────────────────────────────────── */}
      <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Palette size={18} className="text-indigo-600" /> 3. Page Background
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose solid shades, vibrant multi-color gradients, or custom high-res images.
            </p>
          </div>
        </div>

        <BackgroundPicker
          value={customBg}
          onChange={handleBgChange}
        />
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

      {/* ── 5. Typography (Fonts) ────────────────────────────────────────── */}
      <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Type size={18} className="text-indigo-600" /> 5. Typography & Font
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select modern fonts applied specifically to your link buttons and products.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {TRENDING_FONTS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => handleFontChange(f.id)}
              className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                customFont === f.id
                  ? 'border-slate-900 bg-slate-50 shadow-soft ring-2 ring-slate-900/10'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="text-xs font-bold text-slate-900" style={{ fontFamily: f.id }}>
                {f.name}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{f.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Notifications & Save Button */}
      {success && (
        <div className="p-3.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 font-medium animate-fade-in">
          <CheckCircle2 size={16} className="shrink-0" /> {success}
        </div>
      )}

      {error && (
        <div className="p-3.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 font-medium animate-slide-down">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-slate-500">
          Edits auto-save immediately to your live profile.
        </p>
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleSaveCustom}
          loading={saving}
          className="shadow-btn hover:shadow-btn-hover text-xs font-bold px-6 py-3"
        >
          Save Theme
        </Button>
      </div>
    </div>
  );
}
