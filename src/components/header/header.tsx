'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import './header.scss';

// Dynamically import ThemeToggle to avoid hydration issues
const ThemeToggle = dynamic(() => import('@/components/theme-toggle/theme-toggle'), { ssr: false });

export default function Header() {

  return (
    <header className="header">
      <div className="container">
        <div className="header__content">
          <Link href="/" className="header__logo">
            <span className="header__logo-icon">💰</span>
            <span className="header__logo-text">Kiedy Wypłata</span>
          </Link>
          
          <nav className="header__nav">
            <Link href="/family" className="header__nav-link">
              Rodzinne
            </Link>
            <Link href="/pension" className="header__nav-link">
              Emerytury
            </Link>
            <Link href="/benefits" className="header__nav-link">
              Zasiłki
            </Link>
            <Link href="/social" className="header__nav-link">
              Socjalne
            </Link>
          </nav>
          
          <div className="header__actions">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}