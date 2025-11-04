'use client';

import { Payment } from '@/types/payment';
import { getEffectiveNextPayment, daysUntil, getEligiblePayments } from '@/lib/payments';
import './next-payment-banner.scss';

interface NextPaymentBannerProps {
  payments: Payment[];
}

export default function NextPaymentBanner({ payments }: NextPaymentBannerProps) {
  const getNextPayment = () => {
    const today = new Date();
    // Get payments eligible for next payment calculation
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

  if (!nextPayment) {
    return null;
  }

  const effectiveISO = getEffectiveNextPayment(nextPayment);
  const daysUntilVal = getDaysUntilPayment(effectiveISO);
  const isToday = daysUntilVal === 0;
  const isTomorrow = daysUntilVal === 1;

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
        </div>
      </div>
    </div>
  );
}