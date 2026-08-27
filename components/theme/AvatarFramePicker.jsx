'use client';

import { useState } from 'react';
import { Circle, Flame, Layout, Sparkles, Shapes, Zap, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';

// ── Feature Flag: Set to true once billing/subscriptions are live ─────────────
const AVATAR_STYLES_PRO_GATED = false;

const AVATAR_FRAMES = [
  { id: 'classic', label: 'Classic', desc: 'Centered circle', icon: Circle,   isPro: false },
  { id: 'hero',    label: 'Hero',    desc: 'Glow aura & ring',icon: Flame,    isPro: true  },
  { id: 'banner',  label: 'Banner',  desc: 'Header band',     icon: Layout,   isPro: true  },
  { id: 'cutout',  label: 'Cutout',  desc: 'Floating cutout', icon: Sparkles, isPro: true  },
  { id: 'shape',   label: 'Shape',   desc: 'Organic blob',    icon: Shapes,   isPro: true  },
];

export default function AvatarFramePicker({
  currentLayout = 'classic',
  userPlan = 'free',
  onSelectLayout,
}) {
  const isPro = userPlan === 'pro';
  const [selectedLayout, setSelectedLayout] = useState(currentLayout);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function handlePick(layoutId, isProRequired) {
    if (AVATAR_STYLES_PRO_GATED && isProRequired && !isPro) {
      setError('This avatar style is a Pro feature. Please upgrade to use custom frames.');
      return;
    }

    setError(null);
    setMessage(null);
    setSelectedLayout(layoutId);

    if (onSelectLayout) {
      onSelectLayout(layoutId);
    }

    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_layout: layoutId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update avatar style');
      }

      setMessage(`Avatar style set to ${layoutId}!`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Avatar style save error:', err);
      setError(err.message || 'Failed to save avatar style');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-4 text-slate-900 animate-in fade-in duration-150">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User size={18} className="text-indigo-600" /> 1. Profile Avatar (Style / Frame)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Choose how your avatar photo is framed and presented at the top of your page.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 font-medium">
          <CheckCircle2 size={15} className="shrink-0" /> {message}
        </div>
      )}

      {error && (
        <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 font-medium">
          <AlertCircle size={15} className="shrink-0" /> {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {AVATAR_FRAMES.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedLayout === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handlePick(opt.id, opt.isPro)}
              className={`relative flex flex-col items-center p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                isSelected
                  ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10 shadow-soft'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
              }`}
            >
              {AVATAR_STYLES_PRO_GATED && opt.isPro && (
                <span className="absolute top-1.5 right-1.5 text-[9px] font-bold text-amber-700 bg-amber-100 px-1 rounded flex items-center gap-0.5">
                  <Zap size={8} className="fill-amber-600 text-amber-600" /> Pro
                </span>
              )}
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mb-1.5 shadow-2xs">
                <Icon size={18} />
              </div>
              <span className="text-xs font-bold text-slate-900">{opt.label}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
