'use client';

import { useState, useRef } from 'react';
import { Palette, Sparkles, Upload, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabaseClient';

const SOLID_PRESETS = [
  '#ffffff', '#fafaf9', '#f1f5f9', '#e2e8f0',
  '#fef2f2', '#f0fdf4', '#f0f9ff', '#0f172a',
  '#1e1b4b', '#2e1065', '#1c1917', '#09090b',
];

const GRADIENT_PRESETS = [
  'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
  'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)',
  'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
  'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  'linear-gradient(135deg, #1a0533 0%, #3d0068 50%, #c800a1 100%)',
  'linear-gradient(135deg, #020024 0%, #090979 50%, #00d4ff 100%)',
  'linear-gradient(135deg, #0a2e0a 0%, #1a4a1a 50%, #2d8a2d 100%)',
];

export default function BackgroundPicker({ value, onChange }) {
  const currentType = value?.type || 'solid';
  const currentValue = value?.value || '#ffffff';

  const [activeTab, setActiveTab] = useState(
    currentType === 'solid' || currentType === 'gradient' ? 'color' : currentType
  );
  const [colorMode, setColorMode] = useState(currentType === 'gradient' ? 'gradient' : 'solid');

  // Gradient stops (fixed angle 135deg per Issue 4c)
  const [gradColor1, setGradColor1] = useState('#1a1a2e');
  const [gradColor2, setGradColor2] = useState('#0f3460');

  // Image states
  const [imageUrl, setImageUrl] = useState(currentType === 'image' ? currentValue : '');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  function handleColorModeChange(mode) {
    setColorMode(mode);
    if (mode === 'solid') {
      onChange({ type: 'solid', value: SOLID_PRESETS[0] });
    } else {
      const grad = `linear-gradient(135deg, ${gradColor1} 0%, ${gradColor2} 100%)`;
      onChange({ type: 'gradient', value: grad });
    }
  }

  function handleGradColorChange(c1, c2) {
    setGradColor1(c1);
    setGradColor2(c2);
    const grad = `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`;
    onChange({ type: 'gradient', value: grad });
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const filePath = `bg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

      // Upload to avatars bucket (which is configured as public in supabase)
      const { error: uploadErr } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const freshUrl = `${publicUrl}?t=${Date.now()}`;
      setImageUrl(freshUrl);
      onChange({ type: 'image', value: freshUrl });
    } catch (err) {
      setUploadError(err.message || 'Background upload failed. You can also paste a direct image URL in the "Image URL" tab.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4 text-slate-900">
      {/* 3 Main Mode Tabs: Color, Upload Image, Image URL */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 gap-1">
        <button
          type="button"
          onClick={() => {
            setActiveTab('color');
            if (colorMode === 'solid') {
              onChange({ type: 'solid', value: currentValue.startsWith('#') ? currentValue : '#ffffff' });
            } else {
              onChange({ type: 'gradient', value: `linear-gradient(135deg, ${gradColor1} 0%, ${gradColor2} 100%)` });
            }
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'color' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Palette size={14} /> Color
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Upload size={14} /> Upload Image
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'url' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImageIcon size={14} /> Image URL
        </button>
      </div>

      {/* ── Mode 1: Color (Solid or Gradient) ────────────────────────────── */}
      {activeTab === 'color' && (
        <div className="space-y-3.5 pt-1">
          {/* Sub-toggle: Solid vs Gradient */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleColorModeChange('solid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                colorMode === 'solid'
                  ? 'bg-slate-900 text-white shadow-btn'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Solid Color
            </button>
            <button
              type="button"
              onClick={() => handleColorModeChange('gradient')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                colorMode === 'gradient'
                  ? 'bg-slate-900 text-white shadow-btn'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sparkles size={12} className="inline mr-1" /> Gradient Color
            </button>
          </div>

          {/* Solid Color Picker */}
          {colorMode === 'solid' && (
            <div className="space-y-3">
              <div className="grid grid-cols-6 gap-2">
                {SOLID_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onChange({ type: 'solid', value: color })}
                    style={{ backgroundColor: color }}
                    className={`h-9 rounded-xl border-2 transition-transform hover:scale-105 shadow-xs cursor-pointer ${
                      currentValue === color
                        ? 'border-slate-900 scale-105 ring-2 ring-slate-900/20'
                        : 'border-slate-200'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={currentValue.startsWith('#') ? currentValue : '#ffffff'}
                  onChange={(e) => onChange({ type: 'solid', value: e.target.value })}
                  className="w-9 h-9 rounded-xl border border-slate-200 bg-transparent cursor-pointer shadow-xs"
                />
                <span className="text-xs text-slate-600 font-mono font-semibold">
                  {currentValue.startsWith('#') ? currentValue : '#ffffff'}
                </span>
              </div>
            </div>
          )}

          {/* Gradient Color Picker (2 stops) */}
          {colorMode === 'gradient' && (
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 block">Color Stop 1</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={gradColor1}
                      onChange={(e) => handleGradColorChange(e.target.value, gradColor2)}
                      className="w-8 h-8 rounded-xl border border-slate-200 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono font-semibold">{gradColor1}</span>
                  </div>
                </div>

                <div className="h-8 w-px bg-slate-200" />

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 block">Color Stop 2</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={gradColor2}
                      onChange={(e) => handleGradColorChange(gradColor1, e.target.value)}
                      className="w-8 h-8 rounded-xl border border-slate-200 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono font-semibold">{gradColor2}</span>
                  </div>
                </div>
              </div>

              {/* Gradient Presets */}
              <div className="space-y-1 pt-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Gradient Presets
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {GRADIENT_PRESETS.map((grad, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onChange({ type: 'gradient', value: grad })}
                      style={{ background: grad }}
                      className={`h-12 rounded-xl border-2 transition-transform hover:scale-105 shadow-xs cursor-pointer ${
                        currentValue === grad
                          ? 'border-slate-900 scale-105 ring-2 ring-slate-900/20'
                          : 'border-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Mode 2: Upload Image ─────────────────────────────────────────── */}
      {activeTab === 'upload' && (
        <div className="space-y-3 pt-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          {uploadError && (
            <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl">
              {uploadError}
            </div>
          )}

          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-6 border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-3xl bg-slate-50/50 hover:bg-slate-50 text-center cursor-pointer transition-all space-y-2"
          >
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-700 mx-auto flex items-center justify-center shadow-xs">
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                {uploading ? 'Uploading background image...' : 'Click to upload custom background'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">PNG, JPG, or WebP up to 5MB</p>
            </div>
          </div>

          {imageUrl && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-28 bg-cover bg-center shadow-xs" style={{ backgroundImage: `url(${imageUrl})` }}>
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <span className="text-xs font-bold text-white bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs">
                  Active Uploaded Background
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Mode 3: Image URL ─────────────────────────────────────────────── */}
      {activeTab === 'url' && (
        <div className="space-y-3 pt-1">
          <Input
            label="Direct Image URL"
            placeholder="https://images.unsplash.com/photo-..."
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              onChange({ type: 'image', value: e.target.value });
            }}
          />
          {imageUrl && (
            <div
              className="h-28 rounded-2xl border border-slate-200 bg-cover bg-center shadow-xs"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          )}
        </div>
      )}
    </div>
  );
}
