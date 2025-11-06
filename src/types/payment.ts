export interface Payment {
  id: string;
  name: string;
  next_payment: string;
  schedule: string;
  description: string;
  source: string;
  category: 'family' | 'pension' | 'benefits' | 'social';
  excludeFromNext?: boolean; // Optional flag to exclude from next payment calculations
  frequency?: 'monthly' | 'yearly' | 'one-time'; // Payment frequency
  institution?: string; // Institution responsible for payments
  detailed_schedule?: string; // Detailed schedule information
  assignment_method?: string; // How payment dates are assigned
  official_name?: string; // Full official name of the benefit
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
    description: '800+, zasiłki rodzinne, Dobry Start, becikowe',
    icon: '👨‍👩‍👧‍👦'
  },
  {
    id: 'pension',
    name: 'Emerytury i renty',
    description: 'ZUS, KRUS, 13. i 14. emerytura',
    icon: '🛡️'
  },
  {
    id: 'benefits',
    name: 'Zasiłki',
    description: 'Chorobowe, macierzyńskie, opiekuńcze, dla bezrobotnych, pielęgnacyjne',
    icon: '🏥'
  },
  {
    id: 'social',
    name: 'Świadczenia socjalne',
    description: 'Dodatki mieszkaniowe, węglowe, zasiłki stałe',
    icon: '🏠'
  }
];