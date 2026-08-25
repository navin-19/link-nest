'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useLinks } from '@/hooks/useLinks';
import { useTheme } from '@/hooks/useTheme';
import ThemePicker from '@/components/theme/ThemePicker';
import LivePreview from '@/components/dashboard/LivePreview';

export default function ThemePage() {
  const { user, profile } = useUser();
  const { links } = useLinks(user?.id);
  const {
    themes,
    activeTheme,
    loading,
    applyTheme,
    createTheme,
  } = useTheme(profile?.theme_id);

  const [previewTheme, setPreviewTheme] = useState(null);

  useEffect(() => {
    if (activeTheme) {
      setPreviewTheme(activeTheme);
    }
  }, [activeTheme]);

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

        <ThemePicker
          themes={themes}
          activeThemeId={profile?.theme_id}
          onSelectTheme={applyTheme}
          onCreateCustomTheme={createTheme}
          previewTheme={previewTheme}
          setPreviewTheme={setPreviewTheme}
        />
      </div>

      {/* Right: Live Phone Mockup Preview */}
      <div className="lg:col-span-5 sticky top-24 hidden lg:block">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-card">
          <LivePreview
            profile={profile}
            links={links}
            theme={previewTheme || profile?.themes}
          />
        </div>
      </div>
    </div>
  );
}
