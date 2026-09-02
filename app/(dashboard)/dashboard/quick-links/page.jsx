'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useLinks } from '@/hooks/useLinks';
import { useProducts } from '@/hooks/useProducts';
import QuickLinksEditor from '@/components/links/QuickLinksEditor';
import SocialLinksEditor from '@/components/links/SocialLinksEditor';
import Heading from '@/components/ui/Heading';
import LivePreview from '@/components/dashboard/LivePreview';
import {
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles,
  Link2,
  Share2,
} from 'lucide-react';

const FEATURE_STRIP = [
  { icon: Smartphone, title: 'Live Preview', caption: 'Instant real-time sync' },
  { icon: Zap, title: 'Instant Actions', caption: 'One-tap direct buttons' },
  { icon: Sparkles, title: 'Smart Validation', caption: 'Auto URL formatting' },
  { icon: CheckCircle2, title: 'Auto Saved', caption: 'Changes save on blur' },
  { icon: ShieldCheck, title: 'Privacy Protected', caption: 'Secure RLS encryption' },
];

function QuickLinksContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'social' ? 'social-links' : 'quick-links';
  const [activeTab, setActiveTab] = useState(initialTab); // 'quick-links' | 'social-links'

  const { user, profile, loading: userLoading } = useUser();
  const { links, loading: linksLoading, addLink, updateLink, deleteLink } = useLinks(user?.id);
  const { products, loading: productsLoading } = useProducts(user?.id);

  // Local state for instant live preview updates before saving
  const [localProfileEdits, setLocalProfileEdits] = useState({});

  const handleLocalProfileChange = (updatedFields) => {
    setLocalProfileEdits((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  const effectiveProfile = {
    ...(profile || {}),
    ...localProfileEdits,
  };

  if (userLoading || linksLoading || productsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-slate-900 dark:text-slate-100 animate-in fade-in duration-150">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Link & Content Editor */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header Title & Subtitle */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Heading as="h1" className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight flex items-center gap-2.5">
                <Link2 className="text-emerald-500 shrink-0" size={28} />
                <span>Link & Content Editor</span>
              </Heading>
            </div>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Manage your primary action links and contact buttons at the top of your profile.
            </p>
          </div>

          {/* Top Navigation Tabs: [ Quick Action Links ] [ Social Links ] */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('quick-links')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                activeTab === 'quick-links'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <Zap size={14} />
              <span>Quick Action Links</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('social-links')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                activeTab === 'social-links'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <Share2 size={14} />
              <span>Social Links</span>
            </button>
          </div>

          {/* Tab 1: Quick Action Links */}
          {activeTab === 'quick-links' && (
            <div className="animate-in fade-in duration-150">
              <QuickLinksEditor
                profile={effectiveProfile}
                onLocalProfileChange={handleLocalProfileChange}
                links={links}
                onAddLink={addLink}
                onUpdateLink={updateLink}
                onDeleteLink={deleteLink}
              />
            </div>
          )}

          {/* Tab 2: Social Links */}
          {activeTab === 'social-links' && (
            <div className="animate-in fade-in duration-150">
              <SocialLinksEditor
                profile={effectiveProfile}
                onLocalProfileChange={handleLocalProfileChange}
              />
            </div>
          )}
        </div>

        {/* Right Column: Live Phone Mockup Preview (Sticky) */}
        <div className="lg:col-span-5 sticky top-4 hidden lg:block self-start">
          <div className="bg-white dark:bg-[#0c0f1e] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-card">
            <LivePreview
              profile={effectiveProfile}
              links={links}
              products={products}
              theme={profile?.themes}
            />
          </div>
        </div>
      </div>

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

export default function QuickLinksPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <QuickLinksContent />
    </Suspense>
  );
}
