'use client';

import { useState } from 'react';
import { Check, CheckCircle2, AlertCircle } from 'lucide-react';
import { OFFICIAL_PRESET_THEMES } from '@/utils/presetThemes';

export { OFFICIAL_PRESET_THEMES as DEFAULT_PRESET_THEMES };

const PRESET_DESCRIPTIONS = {
  Ember: 'Warm radial amber glow',
  Midnight: 'Deep solid dark space',
  Aurora: 'Teal & navy gradient',
  Sunset: 'Vibrant purple & magenta',
  Ocean: 'Deep blue & cyan wave',
  Forest: 'Rich emerald gradient',
  Cloud: 'Soft white with subtle gray gradient',
  Blossom: 'Pastel pink and cream glow',
  Sand: 'Warm beige and cream tones',
};

export default function PresetThemes({
  themes = [],
  activeThemeId,
  onSelectTheme,
  previewTheme,
  setPreviewTheme,
}) {
  const [applyingId, setApplyingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Exclusively render the 9 official preset themes (6 dark + 3 light)
  const presetThemes = OFFICIAL_PRESET_THEMES;

  async function handlePickPreset(theme) {
    setError(null);
    setSuccess(null);
    setApplyingId(theme.id);
    if (setPreviewTheme) {
      setPreviewTheme(theme);
    }
    try {
      await onSelectTheme(theme.id);
      setSuccess(`Applied "${theme.name}" theme successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to select theme');
    } finally {
      setApplyingId(null);
    }
  }

  return (
    <div className="space-y-4 text-slate-900 dark:text-slate-100 animate-in fade-in duration-150">
      {/* Notifications */}
      {success && (
        <div className="p-3.5 text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-2 font-medium animate-fade-in">
          <CheckCircle2 size={16} className="shrink-0" /> {success}
        </div>
      )}

      {error && (
        <div className="p-3.5 text-xs text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-2 font-medium animate-fade-in">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}

      {/* Grid of 9 Preset Themes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {presetThemes.map((theme) => {
          const isSelected = activeThemeId === theme.id || previewTheme?.id === theme.id;
          const isApplying = applyingId === theme.id;
          const description = theme.description || PRESET_DESCRIPTIONS[theme.name] || `${theme.font || 'Inter'} • ${theme.button_style || 'rounded'}`;

          let bgStyle = {};
          if (theme.background?.type === 'solid') bgStyle = { backgroundColor: theme.background.value };
          else if (theme.background?.type === 'gradient') bgStyle = { background: theme.background.value };
          else if (theme.background?.type === 'image') bgStyle = { backgroundImage: `url(${theme.background.value})`, backgroundSize: 'cover' };

          return (
            <button
              key={theme.id}
              type="button"
              disabled={isApplying}
              onClick={() => handlePickPreset(theme)}
              className={`group relative flex flex-col p-3 rounded-2xl border text-left transition-all overflow-hidden bg-white dark:bg-[#0d1020] shadow-soft hover:shadow-card cursor-pointer ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-card'
                  : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Theme Preview Box */}
              <div
                style={bgStyle}
                className="w-full h-28 rounded-xl mb-3 flex flex-col items-center justify-center p-3 border border-slate-200/60 dark:border-slate-800 shadow-inner transition-transform group-hover:scale-[1.02] relative"
              >
                {/* Mini Link Card Mockup */}
                <div className="w-full max-w-[140px] h-6 rounded-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs border border-white/40 dark:border-slate-700/60 shadow-xs flex items-center justify-center">
                  <span className="text-[10px] text-slate-800 dark:text-slate-200 font-semibold truncate px-2" style={{ fontFamily: theme.font }}>
                    {theme.font || 'Inter'}
                  </span>
                </div>
              </div>

              {/* Theme Info & Selection Check */}
              <div className="flex items-center justify-between mt-auto px-1">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {theme.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block mt-0.5">
                    {description}
                  </span>
                </div>

                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 ml-2 shadow-xs">
                    <Check size={12} strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0 ml-2 group-hover:border-slate-400 transition-colors" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
