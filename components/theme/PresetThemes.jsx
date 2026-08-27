'use client';

import { useState } from 'react';
import { Check, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

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

  async function handlePickPreset(theme) {
    setError(null);
    setSuccess(null);
    setApplyingId(theme.id);
    if (setPreviewTheme) {
      setPreviewTheme(theme);
    }
    try {
      await onSelectTheme(theme.id);
      setSuccess(`Applied "${theme.name || 'Theme'}" theme successfully!`);
    } catch (err) {
      setError(err.message || 'Failed to select theme');
    } finally {
      setApplyingId(null);
    }
  }

  return (
    <div className="space-y-4 pt-1 text-slate-900 animate-in fade-in duration-150">

      {/* Notifications */}
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

      {/* Grid of Preset Themes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {themes.map((theme) => {
          const isSelected = activeThemeId === theme.id || previewTheme?.id === theme.id;
          const isApplying = applyingId === theme.id;

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
              className={`relative group flex flex-col p-3 rounded-2xl border text-left transition-all overflow-hidden bg-white shadow-soft hover:shadow-card cursor-pointer ${
                isSelected
                  ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-card'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div
                style={bgStyle}
                className="w-full h-24 rounded-xl mb-3 flex items-center justify-center p-2 border border-slate-200/60 shadow-inner transition-transform group-hover:scale-[1.02]"
              >
                <div className="w-full h-7 rounded-lg bg-white/85 backdrop-blur-xs border border-slate-200 shadow-xs flex items-center justify-center">
                  <span className="text-[10px] text-slate-800 font-semibold truncate px-2">
                    {theme.font || 'Inter'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-900 truncate block">
                    {theme.name || 'Custom'}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize truncate block">
                    {theme.button_style || 'rounded'} • {theme.font || 'Inter'}
                  </span>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 ml-1 shadow-xs">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
