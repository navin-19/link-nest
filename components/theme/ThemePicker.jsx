'use client';

import { useState } from 'react';
import { Check, Sparkles, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import BackgroundPicker from './BackgroundPicker';
import PresetThemes from './PresetThemes';

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
    <div className="space-y-8 text-slate-900 dark:text-slate-100">
      {/* Action Error Alert */}
      {actionError && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 animate-slide-down">
          <AlertCircle size={16} className="shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Preset Themes Section */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Preset Themes</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Choose from crafted modern themes or build your own.</p>
        
        <PresetThemes
          themes={themes}
          activeThemeId={activeThemeId}
          onSelectTheme={onSelectTheme}
          previewTheme={previewTheme}
          setPreviewTheme={setPreviewTheme}
        />
      </div>

      {/* Custom Theme Builder */}
      <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-500" /> Custom Theme Designer
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Personalize background, button styling, and typography</p>
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
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">Background Style</label>
              <BackgroundPicker
                value={customBg}
                onChange={(bg) => {
                  setCustomBg(bg);
                  setPreviewTheme((prev) => ({ ...prev, background: bg }));
                }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">Button Appearance</label>
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
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-soft ring-1 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{b.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{b.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">Font Family</label>
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
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-soft ring-1 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                    }`}
                  >
                    <span className="text-xs font-semibold text-slate-900 dark:text-white" style={{ fontFamily: f.id }}>{f.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
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
