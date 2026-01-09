
export type Category = 'Alimentação' | 'Transporte' | 'Lazer' | 'Saúde' | 'Educação' | 'Outros' | 'Dívida';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: Category;
  type: 'expense' | 'income';
}

export interface FixedBill {
  id: string;
  name: string;
  amount: number;
  dueDate: number; // day of month
  status: 'paid' | 'pending' | 'overdue';
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  icon: string;
}

export interface Debt {
  id: string;
  name: string;
  total: number;
  remaining: number;
  installments: number;
  paidInstallments: number;
}

export interface UserProfile {
  name: string;
  email: string;
  salary: number;
  extraIncome: number;
  benefits: number;
  isPremium: boolean;
  streak: number;
  lastActive: string;
  hasCompletedOnboarding: boolean;
  theme: 'light' | 'dark';
  militaryMode: boolean;
  rank?: string;
  offlineMode: boolean;
}

export type AppView = 'dashboard' | 'log' | 'bills' | 'goals' | 'profile' | 'debts';
