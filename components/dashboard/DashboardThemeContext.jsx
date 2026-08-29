'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const DashboardThemeContext = createContext({
  themeMode: 'day', // 'day' | 'night'
  toggleTheme: () => {},
  setThemeMode: () => {},
});

export function DashboardThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState('day');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if session preferred night mode
    try {
      const saved = sessionStorage.getItem('linknest_dashboard_theme');
      if (saved === 'night' || saved === 'day') {
        setThemeMode(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  function toggleTheme() {
    setThemeMode((prev) => {
      const next = prev === 'day' ? 'night' : 'day';
      try {
        sessionStorage.setItem('linknest_dashboard_theme', next);
      } catch {
        // ignore
      }
      return next;
    });
  }

  const isNight = themeMode === 'night';

  return (
    <DashboardThemeContext.Provider value={{ themeMode, toggleTheme, setThemeMode, isNight }}>
      <div className={`w-full h-full min-h-screen ${isNight ? 'dark bg-[#0a0b12] text-slate-100' : 'bg-[#f8fafc] text-slate-900'} transition-colors duration-200`}>
        {children}
      </div>
    </DashboardThemeContext.Provider>
  );
}

export function useDashboardTheme() {
  return useContext(DashboardThemeContext);
}
