'use client';

import Link from 'next/link';
import { Payment } from '@/types/payment';
import { getEffectiveNextPayment, daysUntil } from '@/lib/payments';
import './payment-card.scss';

interface PaymentCardProps {
  payment: Payment;
  showNextPayment?: boolean;
  linkToDetail?: boolean;
}

export default function PaymentCard({ payment, showNextPayment = true, linkToDetail = true }: PaymentCardProps) {
  // For excluded payments, use original date without calculation
  const effectiveISO = payment.excludeFromNext 
    ? payment.next_payment 
    : getEffectiveNextPayment(payment);
    
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const computedDaysUntil = daysUntil(effectiveISO);
  const isUpcoming = computedDaysUntil <= 7 && computedDaysUntil >= 0;
  const isPast = computedDaysUntil < 0;

  const cardContent = (
    <div className={`payment-card ${isUpcoming ? 'payment-card--upcoming' : ''} ${isPast ? 'payment-card--past' : ''}`}>
      <div className="payment-card__header">
        <h3 className="payment-card__title">{payment.name}</h3>
        {showNextPayment && payment.next_payment !== "" && (
          <div className="payment-card__date">
            <span className="payment-card__date-label">
              {payment.excludeFromNext ? 
                (payment.id === 'dobry-start' ? 'Wypłata roczna:' : 'Jednorazowa wypłata:') :
                'Następna wypłata:'}
            </span>
            <span className="payment-card__date-value">
              {formatDate(effectiveISO)}
            </span>
            {!isPast && !payment.excludeFromNext && (
              <span className="payment-card__days-counter">
                {computedDaysUntil === 0 ? 'Dziś!' : computedDaysUntil === 1 ? 'Jutro' : `za ${computedDaysUntil} dni`}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="payment-card__content">
        <p className="payment-card__description">{payment.description}</p>
        <div className="payment-card__schedule">
          <strong>Harmonogram:</strong> {payment.schedule}
        </div>
      </div>

      <div className="payment-card__footer">
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            window.open(payment.source, '_blank', 'noopener,noreferrer');
          }}
          className="payment-card__source-link"
          type="button"
        >
          Źródło informacji →
        </button>
      </div>
    </div>
  );

  if (linkToDetail) {
    return (
      <Link href={`/benefit/${payment.id}`} className="payment-card-link">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}