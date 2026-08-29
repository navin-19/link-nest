'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { getProfileUrl } from '@/utils/qrGenerator';
import BusinessCardStudio from '@/components/card/BusinessCardStudio';
import QRCodeCustomizer from '@/components/card/QRCodeCustomizer';
import { CreditCard, QrCode, Sparkles } from 'lucide-react';

export default function CardStudioPage() {
  const { user, profile, loading } = useUser();
  const [activeTab, setActiveTab] = useState('card'); // 'card' | 'qr'

  const profileUrl = profile?.username ? getProfileUrl(profile.username) : '';

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-2xl w-64" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-xl w-96" />
        <div className="h-96 bg-white dark:bg-[#0c0f1d] rounded-3xl border border-slate-200 dark:border-slate-800" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-slate-900 dark:text-slate-100 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              QR & Business Card Studio
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
              <Sparkles size={12} /> PRO
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            Share your profile instantly with a scannable QR code and digital business card.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#0c0f1d] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'card'
                ? 'bg-slate-900 dark:bg-emerald-500 text-white shadow-btn'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <CreditCard size={15} />
            Business Card Studio
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-slate-900 dark:bg-emerald-500 text-white shadow-btn'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <QrCode size={15} />
            QR Customizer
          </button>
        </div>
      </div>

      {/* Main Studio Tab Content */}
      <div>
        {activeTab === 'card' ? (
          <BusinessCardStudio user={user} profile={profile} profileUrl={profileUrl} />
        ) : (
          <QRCodeCustomizer profile={profile} profileUrl={profileUrl} />
        )}
      </div>
    </div>
  );
}
