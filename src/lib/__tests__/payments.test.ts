import { getEffectiveNextPayment, daysUntil, getEligiblePayments } from '../payments';
import { Payment } from '@/types/payment';

describe('Payment Utilities', () => {
  const mockDate = new Date('2025-11-05'); // Fixed date for testing

  const mockPayment: Payment = {
    id: 'test-800plus',
    name: '800+',
    next_payment: '2025-11-25',
    schedule: 'do 25. dnia każdego miesiąca',
    description: 'Test payment',
    source: 'https://zus.pl',
    category: 'family'
  };

  describe('getEffectiveNextPayment', () => {
    test('should return future next_payment date as-is', () => {
      const result = getEffectiveNextPayment(mockPayment, mockDate);
      expect(result).toBe(new Date('2025-11-25').toISOString());
    });

    test('should calculate next monthly payment when current date passed', () => {
      const pastPayment = {
        ...mockPayment,
        next_payment: '2025-10-25' // Past date
      };
      
      const result = getEffectiveNextPayment(pastPayment, mockDate);
      const resultDate = new Date(result);
      
      expect(resultDate.getDate()).toBe(25);
      expect(resultDate.getMonth()).toBe(10); // November (0-indexed)
      expect(resultDate > mockDate).toBe(true);
    });
  });

  describe('daysUntil', () => {
    test('should calculate correct days until future date', () => {
      const futureDate = '2025-11-10';
      const result = daysUntil(futureDate, mockDate);
      expect(result).toBe(5);
    });

    test('should return 0 for same day', () => {
      const sameDate = '2025-11-05';
      const result = daysUntil(sameDate, mockDate);
      expect(result).toBe(0);
    });

    test('should return negative for past dates', () => {
      const pastDate = '2025-11-01';
      const result = daysUntil(pastDate, mockDate);
      expect(result).toBe(-4);
    });
  });

  describe('getEligiblePayments', () => {
    const regularPayment: Payment = {
      ...mockPayment,
      id: 'regular'
    };

    const excludedPayment: Payment = {
      ...mockPayment,
      id: 'dobry-start',
      excludeFromNext: true
    };

    const payments = [regularPayment, excludedPayment];

    test('should exclude payments marked with excludeFromNext', () => {
      const result = getEligiblePayments(payments);
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('regular');
      expect(result.find(p => p.id === 'dobry-start')).toBeUndefined();
    });

    test('should return all payments when none are excluded', () => {
      const allRegular = payments.map(p => ({ ...p, excludeFromNext: false }));
      const result = getEligiblePayments(allRegular);
      
      expect(result).toHaveLength(2);
    });

    test('should handle empty array', () => {
      const result = getEligiblePayments([]);
      expect(result).toEqual([]);
    });
  });
});