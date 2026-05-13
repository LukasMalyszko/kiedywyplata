import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentCard from '../payment-card';
import { createMockPayment } from '@/test-utils/test-utils';

describe('PaymentCard Component', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-11-01T12:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const mockPayment = createMockPayment({
    name: '800+ Test',
    next_payment: '2025-11-25',
    schedule: 'do 25. dnia każdego miesiąca',
    description: 'Test payment description'
  });

  it('renders payment information correctly', () => {
    render(<PaymentCard payment={mockPayment} />);
    
    expect(screen.getByText('800+ Test')).toBeInTheDocument();
    expect(screen.getByText('Test payment description')).toBeInTheDocument();
    expect(screen.getByText(/Harmonogram:/)).toBeInTheDocument();
    expect(screen.getByText('do 25. dnia każdego miesiąca')).toBeInTheDocument();
  });

  it('shows next payment date by default', () => {
    render(<PaymentCard payment={mockPayment} />);
    
    expect(screen.getByText('Następna wypłata:')).toBeInTheDocument();
    expect(screen.getByText(/25 listopada 2025/)).toBeInTheDocument();
  });

  it('hides payment date when showNextPayment is false', () => {
    render(<PaymentCard payment={mockPayment} showNextPayment={false} />);
    
    expect(screen.queryByText('Następna wypłata:')).not.toBeInTheDocument();
  });

  it('displays special labels for excluded payments', () => {
    const dobryStartPayment = createMockPayment({
      id: 'dobry-start',
      name: 'Dobry Start',
      excludeFromNext: true
    });
    
    render(<PaymentCard payment={dobryStartPayment} />);
    
    expect(screen.getByText('Wypłata roczna:')).toBeInTheDocument();
    expect(screen.queryByText(/za \d+ dni/)).not.toBeInTheDocument();
  });

  it('displays special labels for one-time payments', () => {
    const oneTimePayment = createMockPayment({
      id: 'dodatek-weglowy',
      name: 'Dodatek węglowy',
      excludeFromNext: true
    });
    
    render(<PaymentCard payment={oneTimePayment} />);
    
    expect(screen.getByText('Jednorazowa wypłata:')).toBeInTheDocument();
  });

  it('renders title as link when linkToDetail is true', () => {
    render(<PaymentCard payment={mockPayment} linkToDetail={true} />);
    
    const linkElement = screen.getByRole('link', { name: '800+ Test' });
    expect(linkElement).toHaveAttribute('href', '/benefit/test-payment');
  });

  it('does not render title as link when linkToDetail is false', () => {
    render(<PaymentCard payment={mockPayment} linkToDetail={false} />);
    
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('opens source link in new tab', () => {
    const mockOpen = jest.fn();
    const originalOpen = window.open;
    window.open = mockOpen;

    render(<PaymentCard payment={mockPayment} />);
    
    const sourceButton = screen.getByText('Źródło informacji →');
    sourceButton.click();
    
    expect(mockOpen).toHaveBeenCalledWith(
      mockPayment.source,
      '_blank',
      'noopener,noreferrer'
    );

    window.open = originalOpen;
  });
});