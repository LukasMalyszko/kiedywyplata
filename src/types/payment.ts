export interface Payment {
  id: string;
  name: string;
  next_payment: string;
  schedule: string;
  description: string;
  source: string;
  category: 'family' | 'pension' | 'benefits' | 'social';
  excludeFromNext?: boolean; // Optional flag to exclude from next payment calculations
}

export interface PaymentCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const PAYMENT_CATEGORIES: PaymentCategory[] = [
  {
    id: 'family',
    name: 'Świadczenia rodzinne',
    description: '800+, zasiłki rodzinne, Dobry Start',
    icon: '👨‍👩‍👧‍👦'
  },
  {
    id: 'pension',
    name: 'Emerytury i renty',
    description: 'ZUS, KRUS, 13. i 14. emerytura',
    icon: '👴'
  },
  {
    id: 'benefits',
    name: 'Zasiłki',
    description: 'Chorobowe, macierzyńskie, opiekuńcze',
    icon: '🏥'
  },
  {
    id: 'social',
    name: 'Świadczenia socjalne',
    description: 'Dodatek węglowy, wsparcie energetyczne',
    icon: '🏠'
  }
];