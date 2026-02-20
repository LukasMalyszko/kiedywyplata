'use client';

import { useState } from 'react';
import { Payment } from '@/types/payment';
import { getEffectiveNextPayment, daysUntil, getEligiblePayments } from '@/lib/payments';
import './next-payment-banner.scss';

interface NextPaymentBannerProps {
  payments: Payment[];
}

export default function NextPaymentBanner({ payments }: NextPaymentBannerProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const getNextPayment = () => {
    const today = new Date();
    const eligiblePayments = getEligiblePayments(payments);
    const withEffective = eligiblePayments.map(p => ({ p, iso: getEffectiveNextPayment(p, today) }));
    const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const upcoming = withEffective
      .map(({ p, iso }) => ({ p, date: new Date(iso) }))
      .filter(({ date }) => date >= startToday)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return upcoming[0] ? upcoming[0].p : null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDaysUntilPayment = (dateString: string) => daysUntil(dateString);

  const nextPayment = getNextPayment();

  const handleShare = async () => {
    if (!nextPayment) return;
    const effectiveISO = getEffectiveNextPayment(nextPayment);
    const dateStr = formatDate(effectiveISO);
    const title = 'Kiedy Wypłata';
    const text = `Najbliższa wypłata: ${nextPayment.name} – ${dateStr}`;
    const url = typeof window !== 'undefined' ? window.location.origin : '';

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url
        });
        setCopyStatus('idle');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          fallbackCopy(text, url);
        }
      }
      return;
    }
    fallbackCopy(text, url);
  };

  const fallbackCopy = async (text: string, url: string) => {
    const full = `${text} | ${url}`;
    try {
      await navigator.clipboard.writeText(full);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  if (!nextPayment) {
    return null;
  }

  const effectiveISO = getEffectiveNextPayment(nextPayment);
  const daysUntilVal = getDaysUntilPayment(effectiveISO);
  const isToday = daysUntilVal === 0;
  const isTomorrow = daysUntilVal === 1;

  const shareLabel =
    copyStatus === 'copied' ? 'Skopiowano!' : copyStatus === 'error' ? 'Błąd kopiowania' : 'Udostępnij';

  return (
    <div className={`next-payment-banner ${isToday ? 'next-payment-banner--today' : ''}`}>
      <div className="container">
        <div className="next-payment-banner__content">
          <div className="next-payment-banner__icon">
            {isToday ? '🎉' : isTomorrow ? '⏰' : '📅'}
          </div>
          <div className="next-payment-banner__text">
            <h2 className="next-payment-banner__title">
              {isToday ? 'Dziś wypłata!' : isTomorrow ? 'Jutro wypłata!' : 'Najbliższa wypłata:'}
            </h2>
            <p className="next-payment-banner__details">
              <strong>{nextPayment.name}</strong> - {formatDate(effectiveISO)}
              {!isToday && !isTomorrow && (
                <span className="next-payment-banner__countdown">
                  (za {daysUntilVal} {daysUntilVal === 1 ? 'dzień' : daysUntilVal < 5 ? 'dni' : 'dni'})
                </span>
              )}
            </p>
          </div>
          <div className="next-payment-banner__actions">
            <button
              type="button"
              className="next-payment-banner__share"
              onClick={handleShare}
              aria-label={shareLabel}
              disabled={copyStatus === 'copied'}
            >
              <span className="next-payment-banner__share-icon" aria-hidden>⎘</span>
              <span className="next-payment-banner__share-label">{shareLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}