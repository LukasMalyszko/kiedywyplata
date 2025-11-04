'use client';

import { Payment } from '@/types/payment';
import './next-payment-banner.scss';

interface NextPaymentBannerProps {
  payments: Payment[];
}

export default function NextPaymentBanner({ payments }: NextPaymentBannerProps) {
  const getNextPayment = () => {
    const today = new Date();
    const upcomingPayments = payments
      .filter(payment => new Date(payment.next_payment) >= today)
      .sort((a, b) => new Date(a.next_payment).getTime() - new Date(b.next_payment).getTime());
    
    return upcomingPayments[0] || null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDaysUntilPayment = (dateString: string) => {
    const paymentDate = new Date(dateString);
    const today = new Date();
    const diffTime = paymentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nextPayment = getNextPayment();

  if (!nextPayment) {
    return null;
  }

  const daysUntil = getDaysUntilPayment(nextPayment.next_payment);
  const isToday = daysUntil === 0;
  const isTomorrow = daysUntil === 1;

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
              <strong>{nextPayment.name}</strong> - {formatDate(nextPayment.next_payment)}
              {!isToday && !isTomorrow && (
                <span className="next-payment-banner__countdown">
                  (za {daysUntil} {daysUntil === 1 ? 'dzień' : daysUntil < 5 ? 'dni' : 'dni'})
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}