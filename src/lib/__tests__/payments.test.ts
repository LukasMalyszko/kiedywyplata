import {
  getEffectiveNextPayment,
  daysUntil,
  getEligiblePayments,
  getPayoutDatesForPaymentInMonth,
  getUpcomingSeoMonthLinks,
  getMonthlyShiftChanges,
  getMonthPayoutSummary,
  getMonthComparison,
} from '../payments';
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

  describe('getPayoutDatesForPaymentInMonth', () => {
    test('returns at least one ISO date for monthly ZUS-style payment in a future month', () => {
      const p: Payment = {
        ...mockPayment,
        next_payment: '',
        schedule: '10. dnia miesiąca',
      };
      const dates = getPayoutDatesForPaymentInMonth(p, 2026, 6);
      expect(dates.length).toBeGreaterThanOrEqual(1);
      expect(dates[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('returns every schedule day in month, not only next_payment', () => {
      const p: Payment = {
        ...mockPayment,
        next_payment: '2026-03-10',
        schedule: '2., 4., 7. dnia miesiąca',
      };
      const dates = getPayoutDatesForPaymentInMonth(p, 2026, 3);
      expect(dates.length).toBe(3);
      expect(dates.every((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))).toBe(true);
    });

    test('returns snapshot date for excludeFromNext with yearly_snapshots', () => {
      const p: Payment = {
        ...mockPayment,
        excludeFromNext: true,
        next_payment: '',
        yearly_snapshots: {
          '2026': { school_year: '2026/2027', next_payment: '2026-09-30' },
        },
      };
      expect(getPayoutDatesForPaymentInMonth(p, 2026, 9)).toEqual(['2026-09-30']);
      expect(getPayoutDatesForPaymentInMonth(p, 2026, 8)).toEqual([]);
    });
  });

  describe('getUpcomingSeoMonthLinks', () => {
    test('lists only months from current month onward with payouts', () => {
      const p: Payment = {
        ...mockPayment,
        next_payment: '',
        schedule: '15. dnia miesiąca',
      };
      const links = getUpcomingSeoMonthLinks(p, 3);
      expect(links.length).toBeGreaterThan(0);
      const first = links[0];
      const cutoff = new Date();
      const firstDay = new Date(first.year, first.month - 1, 1);
      expect(firstDay.getTime()).toBeGreaterThanOrEqual(
        new Date(cutoff.getFullYear(), cutoff.getMonth(), 1).getTime()
      );
    });
  });

  describe('getMonthlyShiftChanges', () => {
    test('returns shifted payout when schedule day falls on weekend', () => {
      const p: Payment = {
        ...mockPayment,
        id: 'shifted',
        name: 'Shifted Benefit',
        next_payment: '',
        schedule: '15. dnia każdego miesiąca',
      };

      const changes = getMonthlyShiftChanges([p], 2025, 11);
      expect(changes).toEqual([
        {
          paymentId: 'shifted',
          paymentName: 'Shifted Benefit',
          nominalISO: '2025-11-15',
          effectiveISO: '2025-11-14',
        },
      ]);
    });

    test('returns empty list when nominal and effective dates are equal', () => {
      const p: Payment = {
        ...mockPayment,
        id: 'stable',
        next_payment: '',
        schedule: '10. dnia każdego miesiąca',
      };

      const changes = getMonthlyShiftChanges([p], 2025, 11);
      expect(changes).toEqual([]);
    });
  });

  describe('getMonthPayoutSummary', () => {
    test('counts total payouts and active benefits for a month', () => {
      const p1: Payment = {
        ...mockPayment,
        id: 'p1',
        next_payment: '',
        schedule: '10. dnia miesiąca',
      };
      const p2: Payment = {
        ...mockPayment,
        id: 'p2',
        next_payment: '',
        schedule: '2., 4. dnia miesiąca',
      };
      const p3: Payment = {
        ...mockPayment,
        id: 'p3',
        excludeFromNext: true,
        next_payment: '2026-09-30',
      };

      const summary = getMonthPayoutSummary([p1, p2, p3], 2026, 9);
      expect(summary).toEqual({ totalPayouts: 4, activeBenefits: 3 });
    });
  });

  describe('getMonthComparison', () => {
    test('returns benefits with date differences between current and next month', () => {
      const shifted: Payment = {
        ...mockPayment,
        id: 'shifted-monthly',
        name: 'Shifted Monthly',
        next_payment: '',
        schedule: '15. dnia miesiąca',
      };
      const stable: Payment = {
        ...mockPayment,
        id: 'stable-monthly',
        name: 'Stable Monthly',
        next_payment: '',
        schedule: '12. dnia miesiąca',
      };

      const changes = getMonthComparison(
        [shifted, stable],
        { year: 2025, month: 11 },
        { year: 2025, month: 12 }
      );

      expect(changes.length).toBe(1);
      expect(changes[0].paymentId).toBe('shifted-monthly');
      expect(changes[0].leftDates).toEqual(['2025-11-14']);
      expect(changes[0].rightDates).toEqual(['2025-12-15']);
    });
  });
});