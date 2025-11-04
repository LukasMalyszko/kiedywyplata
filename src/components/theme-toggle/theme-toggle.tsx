'use client';

import { useTheme } from '@/contexts/theme-context';
import './theme-toggle.scss';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Przełącz na tryb ${theme === 'light' ? 'ciemny' : 'jasny'}`}
      title={`Przełącz na tryb ${theme === 'light' ? 'ciemny' : 'jasny'}`}
    >
      <div className="theme-toggle__icon-container">
        <span 
          className={`theme-toggle__icon theme-toggle__icon--sun ${theme === 'light' ? 'theme-toggle__icon--active' : ''}`}
          aria-hidden="true"
        >
          ☀️
        </span>
        <span 
          className={`theme-toggle__icon theme-toggle__icon--moon ${theme === 'dark' ? 'theme-toggle__icon--active' : ''}`}
          aria-hidden="true"
        >
          🌙
        </span>
      </div>
      <span className="theme-toggle__label">
        {theme === 'light' ? 'Tryb jasny' : 'Tryb ciemny'}
      </span>
    </button>
  );
}