'use client';

import { Payment } from '@/types/payment';
import './payment-card.scss';

interface PaymentCardProps {
  payment: Payment;
  showNextPayment?: boolean;
}

export default function PaymentCard({ payment, showNextPayment = true }: PaymentCardProps) {
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

  const daysUntil = getDaysUntilPayment(payment.next_payment);
  const isUpcoming = daysUntil <= 7 && daysUntil >= 0;
  const isPast = daysUntil < 0;

  return (
    <div className={`payment-card ${isUpcoming ? 'payment-card--upcoming' : ''} ${isPast ? 'payment-card--past' : ''}`}>
      <div className="payment-card__header">
        <h3 className="payment-card__title">{payment.name}</h3>
        {showNextPayment && (
          <div className="payment-card__date">
            <span className="payment-card__date-label">Następna wypłata:</span>
            <span className="payment-card__date-value">
              {formatDate(payment.next_payment)}
            </span>
            {!isPast && (
              <span className="payment-card__days-counter">
                {daysUntil === 0 ? 'Dziś!' : daysUntil === 1 ? 'Jutro' : `za ${daysUntil} dni`}
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
        <a 
          href={payment.source} 
          target="_blank" 
          rel="noopener noreferrer"
          className="payment-card__source-link"
        >
          Źródło informacji →
        </a>
      </div>
    </div>
  );
}