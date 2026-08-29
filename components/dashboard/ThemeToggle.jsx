'use client';

import { Sun, Moon } from 'lucide-react';
import { useDashboardTheme } from './DashboardThemeContext';

export default function ThemeToggle() {
  const { themeMode, toggleTheme, isNight } = useDashboardTheme();

  return (
    <div className="flex items-center p-1 rounded-full bg-slate-200/70 dark:bg-slate-800/80 border border-slate-300/60 dark:border-slate-700/60 shadow-xs transition-colors">
      <button
        type="button"
        onClick={() => themeMode !== 'day' && toggleTheme()}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          !isNight
            ? 'bg-white text-slate-900 shadow-xs'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        aria-label="Switch to Day mode"
      >
        <Sun size={13} className={!isNight ? 'text-amber-500 fill-amber-500' : 'text-slate-400'} />
        <span>Day</span>
      </button>

      <button
        type="button"
        onClick={() => themeMode !== 'night' && toggleTheme()}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          isNight
            ? 'bg-slate-900 text-white shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        aria-label="Switch to Night mode"
      >
        <Moon size={13} className={isNight ? 'text-indigo-400 fill-indigo-400' : 'text-slate-500'} />
        <span>Night</span>
      </button>
    </div>
  );
}
