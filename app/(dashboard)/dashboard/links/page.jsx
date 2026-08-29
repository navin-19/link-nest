'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useProducts } from '@/hooks/useProducts';
import SocialLinksEditor from '@/components/links/SocialLinksEditor';
import ProductsTab from '@/components/links/ProductsTab';
import GoogleReviewsConfig from '@/components/products/GoogleReviewsConfig';
import ReachOutConfig from '@/components/settings/ReachOutConfig';
import LivePreview from '@/components/dashboard/LivePreview';
import {
  Link2,
  Package,
  Store,
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles,
} from 'lucide-react';

// ── 3 Main Tabs: Quick Links (Default), Products, Business Details ───────────
const TABS = [
  { id: 'links',    label: 'Social Links',     icon: Link2   },
  { id: 'products', label: 'Products',         icon: Package },
  { id: 'business', label: 'Business Details', icon: Store   },
];

const FEATURE_STRIP = [
  {
    icon: Smartphone,
    title: 'Live Preview',
    caption: 'Instant real-time sync',
  },
  {
    icon: Zap,
    title: 'Mobile Responsive',
    caption: 'Optimized for all screens',
  },
  {
    icon: Sparkles,
    title: 'Easy to Use',
    caption: 'Intuitive interface',
  },
  {
    icon: CheckCircle2,
    title: 'Auto Saved',
    caption: 'Changes save as you type',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Private',
    caption: 'Full SSL & RLS encryption',
  },
];

function LinksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabQuery = searchParams.get('tab');

  const { user, profile } = useUser();

  const {
    products,
    loading: productsLoading,
    error: productsError,
    addProduct,
    updateProduct,
    deleteProduct,
    reorderProducts,
  } = useProducts(user?.id);

  // Tab State initialized from query param if valid, or default to 'links'
  const normalizedQuery = tabQuery === 'social' ? 'links' : tabQuery;
  const initialTab = TABS.some((t) => t.id === normalizedQuery) ? normalizedQuery : 'links';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [localProfileEdits, setLocalProfileEdits] = useState({});

  useEffect(() => {
    const normalized = tabQuery === 'social' ? 'links' : tabQuery;
    if (normalized && TABS.some((t) => t.id === normalized)) {
      setActiveTab(normalized);
    }
  }, [tabQuery]);

  function handleTabChange(tabId) {
    setActiveTab(tabId);
    router.replace(`/dashboard/links?tab=${tabId}`, { scroll: false });
  }

  // Combined profile for real-time live preview responsiveness
  const effectiveProfile = {
    ...(profile || {}),
    ...localProfileEdits,
  };

  function handleLocalProfileChange(updates) {
    setLocalProfileEdits((prev) => ({ ...prev, ...updates }));
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 text-slate-900 dark:text-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Editor Tabs & Form Cards */}
        <div className="lg:col-span-7 space-y-6">
          {/* Page Title & Description */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Link & Content Editor
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Manage your social links, contact methods, and digital products in one place.
            </p>
          </div>

          {/* Tab Switcher Pills */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-200/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ── TAB 1: Social Links (Default) ─────────────────────────────────── */}
          {activeTab === 'links' && (
            <SocialLinksEditor
              profile={effectiveProfile}
              onLocalProfileChange={handleLocalProfileChange}
            />
          )}

          {/* ── TAB 2: Products ────────────────────────────────────────────────── */}
          {activeTab === 'products' && (
            <ProductsTab
              userId={user?.id}
              profile={effectiveProfile}
              onLocalProfileChange={handleLocalProfileChange}
              products={products}
              loading={productsLoading}
              error={productsError}
              userLoading={false}
              onAdd={addProduct}
              onUpdate={updateProduct}
              onDelete={deleteProduct}
              onReorder={reorderProducts}
            />
          )}

          {/* ── TAB 3: Business Details (Google Reviews + Reach Out) ────────────── */}
          {activeTab === 'business' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <GoogleReviewsConfig
                profile={effectiveProfile}
                onLocalProfileChange={handleLocalProfileChange}
              />
              <ReachOutConfig
                profile={effectiveProfile}
                onLocalProfileChange={handleLocalProfileChange}
              />
            </div>
          )}
        </div>

        {/* Right Column: Live Phone Mockup Preview (Fixed / Sticky in viewport) */}
        <div className="lg:col-span-5 sticky top-4 hidden lg:block self-start">
          <div className="bg-white dark:bg-[#0c0f1e] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-card">
            <LivePreview
              profile={effectiveProfile}
              products={products}
              theme={profile?.themes}
            />
          </div>
        </div>
      </div>

      {/* ── Bottom Feature Strip ────────────────────────────────────────────── */}
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

export default function LinksPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <LinksContent />
    </Suspense>
  );
}
