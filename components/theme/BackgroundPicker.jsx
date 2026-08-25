'use client';

import { useState } from 'react';
import { Palette, Image as ImageIcon, Sparkles } from 'lucide-react';
import Input from '@/components/ui/Input';

const SOLID_PRESETS = [
  '#ffffff', '#fafaf9', '#f1f5f9', '#e2e8f0',
  '#fef2f2', '#f0fdf4', '#f0f9ff', '#0f172a'
];

const GRADIENT_PRESETS = [
  'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
  'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)',
  'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
  'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
  'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
  'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
];

export default function BackgroundPicker({ value, onChange }) {
  const currentType = value?.type || 'solid';
  const currentValue = value?.value || '#ffffff';

  const [activeTab, setActiveTab] = useState(currentType);
  const [imageUrl, setImageUrl] = useState(currentType === 'image' ? currentValue : '');

  function handleTypeChange(type, defaultValue) {
    setActiveTab(type);
    onChange({ type, value: defaultValue });
  }

  return (
    <div className="space-y-4">
      {/* Type Selector Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 gap-1">
        <button
          type="button"
          onClick={() => handleTypeChange('solid', SOLID_PRESETS[0])}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'solid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Palette size={14} /> Solid Color
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('gradient', GRADIENT_PRESETS[0])}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'gradient' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles size={14} /> Gradient
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('image', imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'image' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImageIcon size={14} /> Image URL
        </button>
      </div>

      {/* Solid Controls */}
      {activeTab === 'solid' && (
        <div className="space-y-3">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {SOLID_PRESETS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onChange({ type: 'solid', value: color })}
                style={{ backgroundColor: color }}
                className={`h-10 rounded-xl border-2 transition-transform hover:scale-105 shadow-xs ${
                  currentValue === color ? 'border-slate-900 scale-105 ring-2 ring-slate-900/20' : 'border-slate-200'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={currentValue.startsWith('#') ? currentValue : '#ffffff'}
              onChange={(e) => onChange({ type: 'solid', value: e.target.value })}
              className="w-10 h-10 rounded-xl border border-slate-200 bg-transparent cursor-pointer shadow-xs"
            />
            <span className="text-xs text-slate-600 font-mono font-semibold">{currentValue}</span>
          </div>
        </div>
      )}

      {/* Gradient Controls */}
      {activeTab === 'gradient' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {GRADIENT_PRESETS.map((grad, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onChange({ type: 'gradient', value: grad })}
              style={{ background: grad }}
              className={`h-16 rounded-2xl border-2 transition-transform hover:scale-105 shadow-soft ${
                currentValue === grad ? 'border-slate-900 scale-105 ring-2 ring-slate-900/20' : 'border-slate-200'
              }`}
            />
          ))}
        </div>
      )}

      {/* Image Controls */}
      {activeTab === 'image' && (
        <div className="space-y-3">
          <Input
            label="Background Image URL"
            placeholder="https://images.unsplash.com/..."
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              onChange({ type: 'image', value: e.target.value });
            }}
          />
          {imageUrl && (
            <div
              className="h-24 rounded-2xl border border-slate-200 bg-cover bg-center shadow-xs"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          )}
        </div>
      )}
    </div>
  );
}
