'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/theme-context';
import { THEME_PACKS } from '@/contexts/theme-context';
import './theme-toggle.scss';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const activeTheme = THEME_PACKS.find((pack) => pack.id === theme) ?? THEME_PACKS[0];

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => document.removeEventListener('click', handleClickOutside, true);
  }, [isOpen]);

  return (
    <div className={`theme-toggle ${isOpen ? 'theme-toggle--open' : ''}`} ref={rootRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="theme-toggle__trigger"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="Wybierz pakiet motywu"
        title="Wybierz pakiet motywu"
      >
        <span className="theme-toggle__badge" aria-hidden="true">
          {activeTheme.shortLabel.slice(0, 1)}
        </span>
        <span className="theme-toggle__meta">
          <span className="theme-toggle__eyebrow">Motyw</span>
          <span className="theme-toggle__label">{activeTheme.label}</span>
        </span>
      </button>

      {isOpen && (
        <div className="theme-toggle__panel" role="dialog" aria-label="Pakiety motywow">
          {THEME_PACKS.map((pack) => (
            <button
              key={pack.id}
              type="button"
              className={`theme-toggle__option ${pack.id === theme ? 'theme-toggle__option--active' : ''}`}
              onClick={() => {
                setTheme(pack.id);
                setIsOpen(false);
              }}
            >
              <span className={`theme-toggle__swatch theme-toggle__swatch--${pack.id}`} aria-hidden="true" />
              <span className="theme-toggle__option-copy">
                <span className="theme-toggle__option-label">{pack.label}</span>
                <span className="theme-toggle__option-description">{pack.description}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}