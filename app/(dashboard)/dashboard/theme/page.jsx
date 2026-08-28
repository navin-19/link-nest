'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useLinks } from '@/hooks/useLinks';
import { useProducts } from '@/hooks/useProducts';
import { useTheme } from '@/hooks/useTheme';
import CustomThemeDesigner from '@/components/theme/CustomThemeDesigner';
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
        <div className="w-8 h-8 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-slate-900">
      {/* Left: Theme Editor */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Appearance & Theme</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Pick presets or craft custom backgrounds, buttons, and typography.
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
      <div className="lg:col-span-5 sticky top-0 hidden lg:block self-start">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-card">
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
