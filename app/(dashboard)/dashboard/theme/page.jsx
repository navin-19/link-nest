'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useLinks } from '@/hooks/useLinks';
import { useProducts } from '@/hooks/useProducts';
import { useTheme } from '@/hooks/useTheme';
import CustomThemeDesigner from '@/components/theme/CustomThemeDesigner';
import Heading from '@/components/ui/Heading';
import LivePreview from '@/components/dashboard/LivePreview';

export default function ThemePage() {
  const { user, profile } = useUser();
  const { links } = useLinks(user?.id);
  const { products } = useProducts(user?.id);
  const {
    themes,
    activeTheme,
    loading,
    applyTheme,
    createTheme,
    updateTheme,
  } = useTheme(profile?.theme_id);

  const [previewTheme, setPreviewTheme] = useState(null);
  const [localProfileEdits, setLocalProfileEdits] = useState({});

  useEffect(() => {
    if (activeTheme) {
      setPreviewTheme(activeTheme);
    }
  }, [activeTheme]);

  const handleLocalProfileChange = (profileUpdates) => {
    setLocalProfileEdits((prev) => ({
      ...prev,
      ...profileUpdates,
    }));
  };

  const effectiveProfile = {
    ...profile,
    ...localProfileEdits,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-slate-900 dark:text-slate-100">
      {/* Left: Theme Editor */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <Heading as="h1" className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Appearance & Theme
          </Heading>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Pick presets or craft custom backgrounds, card styles, and typography.
          </p>
        </div>

        <CustomThemeDesigner
          currentTheme={previewTheme || profile?.themes}
          themes={themes}
          activeThemeId={previewTheme?.id || profile?.theme_id}
          userPlan={profile?.plan || 'free'}
          profile={effectiveProfile}
          onCreateCustomTheme={createTheme}
          onUpdateCustomTheme={updateTheme}
          onSelectTheme={applyTheme}
          setPreviewTheme={setPreviewTheme}
          onLocalProfileChange={handleLocalProfileChange}
        />
      </div>

      {/* Right: Live Phone Mockup Preview */}
      <div className="lg:col-span-5 sticky top-4 hidden lg:block self-start">
        <div className="bg-white dark:bg-[#0c0f1e] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-card">
          <LivePreview
            profile={effectiveProfile}
            links={links}
            products={products}
            theme={previewTheme || profile?.themes}
          />
        </div>
      </div>
    </div>
  );
}
