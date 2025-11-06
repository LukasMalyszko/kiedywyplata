// Test utilities
export const createMockPayment = (overrides = {}) => ({
  id: 'test-payment',
  name: 'Test Payment',
  next_payment: '2025-11-25',
  schedule: 'do 25. dnia każdego miesiąca',
  description: 'Test description',
  source: 'https://test.com',
  category: 'family' as const,
  ...overrides,
});

export const createMockPayments = (count = 3) => 
  Array.from({ length: count }, (_, i) => createMockPayment({
    id: `test-payment-${i}`,
    name: `Test Payment ${i}`,
  }));