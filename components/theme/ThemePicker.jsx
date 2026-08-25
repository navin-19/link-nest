'use client';

import { useState } from 'react';
import { Check, Sparkles, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import BackgroundPicker from './BackgroundPicker';

const BUTTON_STYLES = [
  { id: 'rounded', label: 'Soft Shadow Rounded', desc: 'Sleek white card with drop shadow' },
  { id: 'filled', label: 'Solid Charcoal', desc: 'High-contrast bold fill' },
  { id: 'outline', label: 'Minimal Outline', desc: 'Subtle clean borders' },
  { id: 'shadow', label: 'Elevated Floating Card', desc: 'Deep floating drop shadow' },
];

const FONTS = [
  { id: 'Inter', name: 'Inter (Modern Sans)' },
  { id: 'Outfit', name: 'Outfit (Geometric Clean)' },
  { id: 'Roboto', name: 'Roboto (Classic Sans)' },
];

export default function ThemePicker({
  themes = [],
  activeThemeId,
  onSelectTheme,
  onCreateCustomTheme,
  previewTheme,
  setPreviewTheme,
}) {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customBg, setCustomBg] = useState({ type: 'solid', value: '#ffffff' });
  const [customButtonStyle, setCustomButtonStyle] = useState('rounded');
  const [customFont, setCustomFont] = useState('Inter');
  const [themeName, setThemeName] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState(null);

  async function handlePickPreset(theme) {
    setIsCustomizing(false);
    setActionError(null);
    setPreviewTheme(theme);
    try {
      await onSelectTheme(theme.id);
    } catch (err) {
      setActionError(err.message || 'Failed to select theme');
    }
  }

  async function handleSaveCustom() {
    setSaving(true);
    setActionError(null);
    try {
      const created = await onCreateCustomTheme({
        name: themeName || 'My Custom Theme',
        background: customBg,
        button_style: customButtonStyle,
        font: customFont,
      });
      if (created) {
        await onSelectTheme(created.id);
        setIsCustomizing(false);
      }
    } catch (e) {
      console.error(e);
      setActionError(e.message || 'Failed to save and apply custom theme');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8 text-slate-900">
      {/* Action Error Alert */}
      {actionError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-slide-down">
          <AlertCircle size={16} className="shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Preset Themes Section */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-1">Preset Themes</h3>
        <p className="text-xs text-slate-500 mb-4">Choose from crafted modern themes or build your own.</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {themes.map((theme) => {
            const isSelected = activeThemeId === theme.id;
            let bgStyle = {};
            if (theme.background?.type === 'solid') bgStyle = { backgroundColor: theme.background.value };
            else if (theme.background?.type === 'gradient') bgStyle = { background: theme.background.value };
            else if (theme.background?.type === 'image') bgStyle = { backgroundImage: `url(${theme.background.value})`, backgroundSize: 'cover' };

            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => handlePickPreset(theme)}
                className={`relative group flex flex-col p-3 rounded-2xl border text-left transition-all overflow-hidden bg-white shadow-soft hover:shadow-card cursor-pointer ${
                  isSelected
                    ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-card'
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div
                  style={bgStyle}
                  className="w-full h-20 rounded-xl mb-3 flex items-center justify-center p-2 border border-slate-200/60 shadow-inner"
                >
                  <div className="w-full h-6 rounded-lg bg-white/80 backdrop-blur-xs border border-slate-200 shadow-xs flex items-center justify-center">
                    <span className="text-[10px] text-slate-800 font-semibold">Link Preview</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 truncate">{theme.name || 'Custom'}</span>
                  {isSelected && <Check size={14} className="text-slate-900 shrink-0" strokeWidth={2.5} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Theme Builder */}
      <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-600" /> Custom Theme Designer
            </h3>
            <p className="text-xs text-slate-500">Personalize background, button styling, and typography</p>
          </div>
          <Button
            size="sm"
            variant={isCustomizing ? 'primary' : 'secondary'}
            onClick={() => setIsCustomizing(!isCustomizing)}
            className={isCustomizing ? 'shadow-btn' : 'shadow-soft'}
          >
            {isCustomizing ? 'Close Customizer' : 'Customize'}
          </Button>
        </div>

        {isCustomizing && (
          <div className="space-y-6 pt-4 border-t border-slate-100 animate-fade-in">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">Background Style</label>
              <BackgroundPicker
                value={customBg}
                onChange={(bg) => {
                  setCustomBg(bg);
                  setPreviewTheme((prev) => ({ ...prev, background: bg }));
                }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">Button Appearance</label>
              <div className="grid grid-cols-2 gap-2.5">
                {BUTTON_STYLES.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setCustomButtonStyle(b.id);
                      setPreviewTheme((prev) => ({ ...prev, button_style: b.id }));
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      customButtonStyle === b.id
                        ? 'border-slate-900 bg-slate-50 shadow-soft ring-1 ring-slate-900/10'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">{b.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{b.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">Font Family</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {FONTS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setCustomFont(f.id);
                      setPreviewTheme((prev) => ({ ...prev, font: f.id }));
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      customFont === f.id
                        ? 'border-slate-900 bg-slate-50 shadow-soft ring-1 ring-slate-900/10'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <span className="text-xs font-semibold text-slate-900" style={{ fontFamily: f.id }}>{f.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                variant="primary"
                onClick={handleSaveCustom}
                loading={saving}
                className="shadow-btn hover:shadow-btn-hover"
              >
                Save & Apply Theme
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
