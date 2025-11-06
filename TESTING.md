# Testing Strategy for Kiedy Wypłata

## 📋 Overview

This document outlines the comprehensive testing approach for the Kiedy Wypłata application, focusing on the most critical business logic and user interactions.

## 🏗️ Testing Stack

### Core Testing Libraries
- **Jest** - Test runner and assertion library
- **Testing Library** - React component testing
- **Playwright** - End-to-end browser testing
- **MSW** - API mocking (for future external integrations)

## 🎯 Testing Priorities

### 1. **Critical Business Logic** (Must Test)

#### Payment Date Calculations (`src/lib/payments.ts`)
- ✅ `getEffectiveNextPayment()` - Core date calculation logic
- ✅ `daysUntil()` - Countdown calculations  
- ✅ `getEligiblePayments()` - Filtering excluded payments
- ✅ Edge cases: month boundaries, leap years, invalid dates

#### Payment Filtering Logic
- ✅ "Dobry Start" exclusion from next payment calculations
- ✅ "Dodatek węglowy" one-time payment handling
- ✅ Category-based filtering

### 2. **Component Integration** (Should Test)

#### PaymentCard Component
- ✅ Regular payment display with countdown
- ✅ Excluded payment display (no countdown, special labels)
- ✅ Link/non-link variations
- ✅ Theme compatibility

#### NextPaymentBanner
- ✅ Correct next payment selection
- ✅ Excluded payment filtering
- ✅ Date formatting and countdown

#### Theme System
- ✅ Theme switching functionality
- ✅ localStorage persistence
- ✅ Hydration safety

### 3. **User Journeys** (E2E Tests)

#### Navigation Flow
- ✅ Homepage → Category page → Benefit detail
- ✅ Payment card interactions
- ✅ Breadcrumb navigation

#### Payment Information Display
- ✅ Correct dates and countdowns
- ✅ Excluded payments show proper labels
- ✅ Category filtering works correctly

#### Responsive Design
- ✅ Mobile layout functionality
- ✅ Desktop layout
- ✅ Theme switching on all devices

## 🚀 Getting Started

### Installation

1. **Install testing dependencies:**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest jest jest-environment-jsdom @playwright/test msw
```

2. **Initialize Playwright:**
```bash
npx playwright install
```

### Running Tests

#### Unit & Integration Tests
```bash
# Run all tests
npm run test

# Watch mode during development
npm run test:watch

# Run with coverage
npm run test:coverage
```

#### E2E Tests
```bash
# Run E2E tests
npm run test:e2e

# Run with UI (visual test runner)
npm run test:e2e:ui

# Run all tests (unit + E2E)
npm run test:all
```

## 📁 Test File Structure

```
src/
├── lib/
│   ├── __tests__/
│   │   └── payments.test.ts          # Critical business logic
│   └── payments.ts
├── components/
│   ├── payment-card/
│   │   ├── __tests__/
│   │   │   └── payment-card.test.tsx # Component tests
│   │   └── payment-card.tsx
│   └── ...
├── test-utils/
│   ├── setup-tests.ts                # Jest setup
│   └── test-utils.tsx                # Custom render functions
└── ...

tests/
└── e2e/
    ├── main.spec.ts                   # Main user journeys
    ├── payment-calculations.spec.ts   # Date calculation E2E
    └── responsive.spec.ts             # Mobile/desktop tests

playwright.config.ts                  # Playwright configuration
jest.config.js                       # Jest configuration
```

## 🎯 Test Examples

### Unit Test Example (Business Logic)
```typescript
describe('getEffectiveNextPayment', () => {
  it('should handle excluded payments correctly', () => {
    const dobryStart = {
      id: 'dobry-start',
      excludeFromNext: true,
      next_payment: '2025-08-31',
      schedule: 'do 31 sierpnia każdego roku'
    };
    
    // Should return original date for excluded payments
    const result = getEffectiveNextPayment(dobryStart);
    expect(result).toBe('2025-08-31T00:00:00.000Z');
  });
});
```

### Component Test Example
```typescript
it('shows special label for annual payments', () => {
  const dobryStartPayment = createMockPayment({
    id: 'dobry-start',
    excludeFromNext: true
  });
  
  render(<PaymentCard payment={dobryStartPayment} />);
  
  expect(screen.getByText('Wypłata roczna:')).toBeInTheDocument();
  expect(screen.queryByText(/za \d+ dni/)).not.toBeInTheDocument();
});
```

### E2E Test Example
```typescript
test('should display excluded payments correctly', async ({ page }) => {
  await page.goto('/benefit/dobry-start');
  
  await expect(page.getByText('Wypłata roczna:')).toBeVisible();
  await expect(page.getByText(/za \d+ dni/)).not.toBeVisible();
});
```

## 📊 Coverage Goals

### Minimum Coverage Thresholds
- **Lines**: 70%
- **Functions**: 70% 
- **Branches**: 70%
- **Statements**: 70%

### Priority Coverage Areas
1. **`src/lib/payments.ts`** - 90%+ (critical business logic)
2. **PaymentCard component** - 85%+ (core UI component)
3. **Theme system** - 80%+ (hydration-critical)

## 🔧 CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run test:coverage
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

## 🐛 Common Testing Scenarios

### Date Calculation Edge Cases
- Month boundaries (Jan 31 → Feb 28/29)
- Leap year handling
- Invalid input dates
- Polish month names parsing

### Theme System Testing
- Initial hydration without mismatch
- localStorage persistence
- Theme switching animations
- System preference detection

### Payment Filtering
- Excluded payments not in "next payment" calculations
- Category filtering accuracy
- Empty state handling

## 📝 Testing Best Practices

### Do's ✅
- Test behavior, not implementation
- Use descriptive test names in Polish context
- Mock external dependencies (AdSense, analytics)
- Test both happy path and edge cases
- Use realistic test data from `data/payments.json`

### Don'ts ❌
- Don't test implementation details
- Don't test third-party libraries
- Don't use real dates without mocking
- Don't skip accessibility testing
- Don't test styles unless critical for functionality

## 🎯 Next Steps

1. **Install dependencies** using the provided package.json updates
2. **Start with critical business logic tests** (`payments.test.ts`)
3. **Add component tests** for PaymentCard and NextPaymentBanner  
4. **Implement E2E tests** for main user journeys
5. **Set up CI/CD pipeline** with test automation
6. **Monitor coverage** and improve over time

## 🔍 Additional Testing Considerations

### Performance Testing
- Core Web Vitals monitoring
- Bundle size impact
- Lazy loading verification

### Accessibility Testing
- Keyboard navigation
- Screen reader compatibility
- Color contrast validation

### SEO Testing
- Metadata generation accuracy
- Structured data validation
- Canonical URL verification