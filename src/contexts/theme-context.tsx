'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'paper-planner' | 'high-contrast' | 'minimal-data';

export const THEME_PACKS: Array<{
  id: Theme;
  label: string;
  shortLabel: string;
  description: string;
}> = [
  {
    id: 'light',
    label: 'Tryb jasny',
    shortLabel: 'Jasny',
    description: 'Klasyczny jasny wygląd z lekkimi akcentami.',
  },
  {
    id: 'dark',
    label: 'Tryb ciemny',
    shortLabel: 'Ciemny',
    description: 'Wieczorny wariant z ciemnym tłem i chłodnymi akcentami.',
  },
  {
    id: 'paper-planner',
    label: 'Papierowy planer',
    shortLabel: 'Planner',
    description: 'Ciepły papier, delikatne kontrasty i notatnikowy charakter.',
  },
  {
    id: 'high-contrast',
    label: 'Wysoki kontrast',
    shortLabel: 'Kontrast',
    description: 'Mocne rozróżnienie treści z bardzo czytelnymi stanami focus.',
  },
  {
    id: 'minimal-data',
    label: 'Minimalna ilość danych',
    shortLabel: 'Data',
    description: 'Zwarty, analityczny widok z ograniczoną paletą kolorów.',
  },
];

function isTheme(value: string | null): value is Theme {
  return THEME_PACKS.some((pack) => pack.id === value);
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // This effect only runs on mount (client-side) to avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Load saved theme after component mounts (client-side only)
  useEffect(() => {
    if (mounted) {
      const savedTheme = localStorage.getItem('kiedywyplata-theme');
      if (isTheme(savedTheme)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setThemeState(savedTheme);
      }
    }
  }, [mounted]);

  // Apply theme to document and localStorage
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('kiedywyplata-theme', theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setThemeState((prev) => {
      const currentIndex = THEME_PACKS.findIndex((pack) => pack.id === prev);
      const nextIndex = (currentIndex + 1) % THEME_PACKS.length;
      return THEME_PACKS[nextIndex].id;
    });
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <div data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}