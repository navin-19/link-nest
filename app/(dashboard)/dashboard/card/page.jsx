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
        <div className="h-8 bg-slate-200 rounded-2xl w-64" />
        <div className="h-4 bg-slate-200 rounded-xl w-96" />
        <div className="h-96 bg-white rounded-3xl border border-slate-200" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-slate-900 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              QR & Business Card Studio
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Sparkles size={12} /> PRO
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Design, customize, and export printable digital business cards and high-res vector QR codes.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-2xl shadow-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'card'
                ? 'bg-slate-900 text-white shadow-btn'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
                ? 'bg-slate-900 text-white shadow-btn'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
