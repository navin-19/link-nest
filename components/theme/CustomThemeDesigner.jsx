'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Palette,
  Sparkles,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Trash2,
  RotateCcw,
  Check,
  Type,
  LayoutGrid,
} from 'lucide-react';
import PresetThemes from './PresetThemes';
import Button from '@/components/ui/Button';
import Heading from '@/components/ui/Heading';
import { createClient } from '@/lib/supabaseClient';
import { BUTTON_STYLES } from '@/components/links/buttonStyles';
import { OFFICIAL_PRESET_THEMES } from '@/utils/presetThemes';

const SUPPORTED_FONTS = [
  { id: 'Outfit',           name: 'Outfit',           desc: 'Contemporary Round' },
  { id: 'Inter',            name: 'Inter',            desc: 'Balanced & Clean Sans' },
  { id: 'Roboto',           name: 'Roboto',           desc: 'Classic Neutral' },
  { id: 'Poppins',          name: 'Poppins',          desc: 'Geometric Modern' },
  { id: 'Space Grotesk',    name: 'Space Grotesk',    desc: 'Tech & Modern' },
  { id: 'DM Sans',          name: 'DM Sans',          desc: 'Clean & Legible' },
  { id: 'Sora',             name: 'Sora',             desc: 'Futuristic Sharp' },
  { id: 'Playfair Display', name: 'Playfair Display', desc: 'Elegant Editorial Serif' },
  { id: 'Montserrat',       name: 'Montserrat',       desc: 'Bold Editorial' },
];

// Initial 4 primary card styles
const PRIMARY_CARD_STYLES = [
  { id: 'rounded',       label: 'Rounded', desc: 'Soft card with gentle shadow' },
  { id: 'glassmorphism', label: 'Glass',   desc: 'Translucent frosted glass blur' },
  { id: 'outline',       label: 'Outline', desc: 'Subtle clean border lines' },
  { id: 'filled',        label: 'Filled',  desc: 'High-contrast solid fill' },
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
  const [activeTab, setActiveTab] = useState('presets'); // 'presets' | 'customize'

  // Customization Form State
  const [bgType, setBgType] = useState('gradient');
  const [bgValue, setBgValue] = useState(
    currentTheme?.background?.value || 'radial-gradient(circle at 50% 15%, rgba(234, 88, 12, 0.35) 0%, rgba(180, 83, 9, 0.15) 35%, rgba(9, 9, 11, 0.98) 75%)'
  );
  const [bgImageUrlInput, setBgImageUrlInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [selectedFont, setSelectedFont] = useState(currentTheme?.font || 'Outfit');
  const [textColor, setTextColor] = useState(currentTheme?.text_color || '#ffffff');
  const [selectedCardDesign, setSelectedCardDesign] = useState(currentTheme?.button_style || 'rounded');
  const [showMoreCards, setShowMoreCards] = useState(false);

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Sync state from current theme prop
  useEffect(() => {
    if (currentTheme) {
      if (currentTheme.background) {
        setBgType(currentTheme.background.type || 'gradient');
        setBgValue(currentTheme.background.value || '');
        if (currentTheme.background.type === 'image') {
          setBgImageUrlInput(currentTheme.background.value || '');
        }
      }
      if (currentTheme.font) setSelectedFont(currentTheme.font);
      if (currentTheme.text_color) setTextColor(currentTheme.text_color);
      if (currentTheme.button_style) setSelectedCardDesign(currentTheme.button_style);
    }
  }, [currentTheme]);

  // Push updates to Live Preview in real time
  const updateLocalPreview = (newBg, newFont, newCardDesign, newTextColor) => {
    if (setPreviewTheme) {
      setPreviewTheme((prev) => ({
        ...prev,
        background: newBg || { type: bgType, value: bgValue },
        font: newFont || selectedFont,
        button_style: newCardDesign || selectedCardDesign,
        text_color: newTextColor !== undefined ? newTextColor : textColor,
      }));
    }
  };

  // 1. Background Image Handlers
  async function handleImageFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size must be less than 5MB.');
      return;
    }

    setUploadingImage(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `bg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      const { error: uploadErr } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const freshUrl = `${publicUrl}?t=${Date.now()}`;
      setBgType('image');
      setBgValue(freshUrl);
      setBgImageUrlInput(freshUrl);

      const newBg = { type: 'image', value: freshUrl };
      updateLocalPreview(newBg, selectedFont, selectedCardDesign, textColor);
      setStatusMessage('Background image uploaded successfully.');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error('[Upload error]', err);
      setErrorMessage(err.message || 'Failed to upload background image. You can also paste an Image URL.');
    } finally {
      setUploadingImage(false);
    }
  }

  function handleApplyImageUrl() {
    if (!bgImageUrlInput.trim()) {
      setErrorMessage('Please enter an image URL.');
      return;
    }
    const cleanUrl = bgImageUrlInput.trim();
    setBgType('image');
    setBgValue(cleanUrl);

    const newBg = { type: 'image', value: cleanUrl };
    updateLocalPreview(newBg, selectedFont, selectedCardDesign, textColor);
    setStatusMessage('Background image URL applied.');
    setTimeout(() => setStatusMessage(null), 3000);
  }

  function handleRemoveBgImage() {
    const defaultBg = { type: 'solid', value: '#09090b' };
    setBgType('solid');
    setBgValue('#09090b');
    setBgImageUrlInput('');
    updateLocalPreview(defaultBg, selectedFont, selectedCardDesign, textColor);
    setStatusMessage('Background image removed.');
    setTimeout(() => setStatusMessage(null), 3000);
  }

  // 2. Font Selection Handler
  function handleFontSelect(fontId) {
    setSelectedFont(fontId);
    updateLocalPreview(null, fontId, selectedCardDesign, textColor);
  }

  // 3. Text Color Handler
  function handleTextColorChange(newColor) {
    setTextColor(newColor);
    updateLocalPreview(null, selectedFont, selectedCardDesign, newColor);
  }

  // 4. Card Design Selection Handler
  function handleCardDesignSelect(cardId) {
    setSelectedCardDesign(cardId);
    updateLocalPreview(null, selectedFont, cardId, textColor);
  }

  // 5. Save Changes Action
  async function handleSaveChanges() {
    setSaving(true);
    setErrorMessage(null);
    setStatusMessage(null);

    const customThemePayload = {
      name: 'Custom Theme',
      background: { type: bgType, value: bgValue },
      button_style: selectedCardDesign,
      font: selectedFont,
      text_color: textColor,
    };

    try {
      const isCustomUserTheme = Boolean(currentTheme?.id && currentTheme?.user_id);

      if (isCustomUserTheme && onUpdateCustomTheme) {
        const updated = await onUpdateCustomTheme(currentTheme.id, customThemePayload);
        if (setPreviewTheme) setPreviewTheme(updated);
      } else if (onCreateCustomTheme) {
        const created = await onCreateCustomTheme(customThemePayload);
        if (created) {
          if (onSelectTheme) await onSelectTheme(created.id);
          if (setPreviewTheme) setPreviewTheme(created);
        }
      }

      setStatusMessage('Changes saved successfully.');
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      console.error('[Save error]', err);
      setErrorMessage(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  }

  // 6. Reset to Default Action
  function handleResetToDefault() {
    const ember = OFFICIAL_PRESET_THEMES[0];
    setBgType(ember.background.type);
    setBgValue(ember.background.value);
    setBgImageUrlInput('');
    setSelectedFont(ember.font);
    setTextColor('#ffffff');
    setSelectedCardDesign(ember.button_style);
    updateLocalPreview(ember.background, ember.font, ember.button_style, '#ffffff');
    setStatusMessage('Customization reset to default theme.');
    setTimeout(() => setStatusMessage(null), 3000);
  }

  const THEME_TABS = [
    { id: 'presets',   label: 'Preset Themes',   icon: Palette  },
    { id: 'customize', label: 'Customize Theme', icon: Sparkles },
  ];

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 animate-in fade-in duration-150">
      {/* ── Segmented Tab Switcher ── */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs">
        {THEME_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/40'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'} />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: PRESET THEMES ─────────────────────────────────────────── */}
      {activeTab === 'presets' && (
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <Heading as="h3" className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Palette size={18} className="text-emerald-500" /> Preset Themes
              </Heading>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select from 6 professionally crafted themes. Free and paid plans include all presets.
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
      )}

      {/* ── TAB 2: CUSTOMIZE THEME ───────────────────────────────────────── */}
      {activeTab === 'customize' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {statusMessage && (
            <div className="p-3.5 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl flex items-center gap-2 font-medium animate-fade-in">
              <CheckCircle2 size={16} className="shrink-0" /> {statusMessage}
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-2xl flex items-center gap-2 font-medium animate-fade-in">
              <AlertCircle size={16} className="shrink-0" /> {errorMessage}
            </div>
          )}

          {/* ── 1. Background Image ────────────────────────────────────── */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-4">
            <div>
              <Heading as="h4" className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon size={16} className="text-emerald-500" /> Background Image
              </Heading>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Set a custom background image for your public profile.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-2">
              {/* Image Preview */}
              <div className="flex flex-col items-center justify-center h-32 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070914] overflow-hidden relative group">
                {bgType === 'image' && bgValue ? (
                  <>
                    <img
                      src={bgValue}
                      alt="Background Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveBgImage}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-red-400 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Remove Image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-3">
                    <ImageIcon size={24} className="mx-auto text-slate-400 mb-1" />
                    <span className="text-[11px] text-slate-400 font-medium">No Image Set</span>
                  </div>
                )}
              </div>

              {/* Upload Image Button */}
              <div className="flex flex-col justify-center h-32 p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-center space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFileUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  loading={uploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full text-xs font-semibold cursor-pointer"
                >
                  <Upload size={14} className="mr-1.5" /> Upload Image
                </Button>
                <span className="text-[10px] text-slate-400">PNG, JPG, WebP up to 5MB</span>
              </div>

              {/* Image URL Input */}
              <div className="flex flex-col justify-center h-32 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Direct Image URL</span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={bgImageUrlInput}
                    onChange={(e) => setBgImageUrlInput(e.target.value)}
                    className="flex-1 min-w-0 px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleApplyImageUrl}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 transition-all cursor-pointer shrink-0"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. Typography & Font ────────────────────────────────────── */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-4">
            <div>
              <Heading as="h4" className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Type size={16} className="text-emerald-500" /> Typography & Font
              </Heading>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select a modern font style for your profile text and button links.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {SUPPORTED_FONTS.map((f) => {
                const isSelected = selectedFont === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleFontSelect(f.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20 shadow-soft'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white" style={{ fontFamily: f.id }}>
                        {f.name}
                      </span>
                      {isSelected && <Check size={13} className="text-emerald-500" strokeWidth={3} />}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{f.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Live Typography Preview Box */}
            <div
              style={{ fontFamily: selectedFont, color: textColor }}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center space-y-1 mt-3"
            >
              <div className="text-2xl font-bold">Aa</div>
              <div className="text-xs font-medium opacity-90">
                This is how your profile will look ({selectedFont})
              </div>
            </div>
          </div>

          {/* ── 3. Text Color (Single Text Color Customization) ─────────── */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-4">
            <div>
              <Heading as="h4" className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Palette size={16} className="text-emerald-500" /> Text Color
              </Heading>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Customize the text color for your profile name, bio, links, and sections.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: textColor }}
                  className="w-8 h-8 rounded-xl border border-black/15 dark:border-white/20 shadow-xs shrink-0"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Profile Text Color
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 uppercase">
                    {textColor}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => handleTextColorChange(e.target.value)}
                  className="w-9 h-9 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-800 shrink-0"
                  title="Choose text color"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => handleTextColorChange(e.target.value)}
                  className="w-24 px-2.5 py-1.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white uppercase"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          </div>

          {/* ── 4. Card Design (Initial 4 Primary Cards + More Accordion) ── */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-4">
            <div>
              <Heading as="h4" className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <LayoutGrid size={16} className="text-emerald-500" /> Card Design
              </Heading>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select a card structure for your link buttons and content sections.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRIMARY_CARD_STYLES.map((c) => {
                const isSelected = selectedCardDesign === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCardDesignSelect(c.id)}
                    className={`group relative flex flex-col p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20 shadow-soft'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                    }`}
                  >
                    {/* Mini Preview Box */}
                    <div className="w-full h-16 rounded-xl bg-slate-100 dark:bg-slate-800/80 mb-2 flex flex-col items-center justify-center p-2 border border-slate-200/60 dark:border-slate-700">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">@username</span>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{c.label}</span>
                      {isSelected && <Check size={14} className="text-emerald-500" strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── More Card Designs Expandable Accordion ── */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowMoreCards((prev) => !prev)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <LayoutGrid size={14} className="text-slate-500" />
                  <span>More Card Designs</span>
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${showMoreCards ? 'rotate-180' : ''}`}
                />
              </button>

              {showMoreCards && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3 animate-in fade-in duration-150">
                  {BUTTON_STYLES.filter((b) => !PRIMARY_CARD_STYLES.some((p) => p.id === b.id)).map((b) => {
                    const isSelected = selectedCardDesign === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => handleCardDesignSelect(b.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20 shadow-soft'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{b.label}</span>
                          {isSelected && <Check size={12} className="text-emerald-500" strokeWidth={3} />}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{b.desc}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── 5. Save Changes & Reset Action Bar ─────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw size={13} /> Reset to Default
            </button>

            <Button
              type="button"
              variant="primary"
              size="md"
              loading={saving}
              onClick={handleSaveChanges}
              className="w-full sm:w-auto shadow-btn hover:shadow-btn-hover text-xs font-bold px-7 py-3 cursor-pointer"
            >
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
