'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export const ThemeModeContext = createContext({
  mode: 'light', // 'light' | 'dark'
  setMode: () => {},
  toggleMode: () => {},
});

export function ThemeModeProvider({ children }) {
  const [mode, setModeState] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('linknest-theme-mode');
      if (saved === 'dark' || saved === 'light') {
        setModeState(saved);
        if (saved === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initial = prefersDark ? 'dark' : 'light';
        setModeState(initial);
        if (initial === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const setMode = (newMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem('linknest-theme-mode', newMode);
    } catch {
      // ignore
    }
    if (newMode === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const toggleMode = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeModeContext);
}
