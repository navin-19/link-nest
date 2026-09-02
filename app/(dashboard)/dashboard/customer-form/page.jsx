'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import CustomerFormSettings from '@/components/settings/CustomerFormSettings';
import Heading from '@/components/ui/Heading';
import {
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles,
  FileText,
} from 'lucide-react';

const FEATURE_STRIP = [
  { icon: Smartphone, title: 'Live Preview', caption: 'Instant real-time sync' },
  { icon: Zap, title: 'Mobile Responsive', caption: 'Optimized for all screens' },
  { icon: Sparkles, title: 'Easy to Use', caption: 'Intuitive interface' },
  { icon: CheckCircle2, title: 'Auto Saved', caption: 'Changes save as you type' },
  { icon: ShieldCheck, title: 'Secure & Private', caption: 'Full SSL & RLS encryption' },
];

export default function CustomerFormPage() {
  const { profile, loading: userLoading } = useUser();
  const [localProfileEdits, setLocalProfileEdits] = useState({});

  const effectiveProfile = {
    ...(profile || {}),
    ...localProfileEdits,
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-slate-900 dark:text-slate-100 animate-in fade-in duration-150">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Heading as="h1" className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight flex items-center gap-2.5">
            <FileText className="text-emerald-500 shrink-0" size={28} />
            <span>Customer Form</span>
          </Heading>
        </div>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          Manage your visitor lead capture form, customize collected fields, and toggle visibility.
        </p>
      </div>

      <CustomerFormSettings
        profile={effectiveProfile}
      />

      {/* Bottom Feature Strip */}
      <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {FEATURE_STRIP.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-[#0c0f1d]/70 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Icon size={17} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {item.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
