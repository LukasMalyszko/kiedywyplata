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
    test('should return future next_payment date as-is (YYYY-MM-DD, adjusted to working day when needed)', () => {
      const result = getEffectiveNextPayment(mockPayment, mockDate);
      // 25 Nov 2025 is Tuesday (working day) – unchanged
      expect(result).toBe('2025-11-25');
    });

    test('should calculate next monthly payment when current date passed', () => {
      const pastPayment = {
        ...mockPayment,
        next_payment: '2025-10-25' // Past date
      };
      const result = getEffectiveNextPayment(pastPayment, mockDate);
      expect(result).toBe('2025-11-25'); // 25 Nov is Tuesday (working day)
      expect(new Date(result) > mockDate).toBe(true);
    });

    test('should adjust to previous working day when nominal date is Sunday', () => {
      // 10 Nov 2025 is Monday; 15 Nov 2025 is Saturday – ZUS pays on Friday 14th
      const paymentWith15th: Payment = {
        ...mockPayment,
        next_payment: '',
        schedule: '15. dnia każdego miesiąca'
      };
      const result = getEffectiveNextPayment(paymentWith15th, new Date('2025-11-01'));
      expect(result).toBe('2025-11-14'); // Friday before Saturday 15th
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