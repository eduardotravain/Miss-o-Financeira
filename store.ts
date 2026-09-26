import { useState, useEffect } from 'react';
import { UserProfile, Transaction, FixedBill, Goal, Debt } from './types';

const STORAGE_KEY = 'sentinela_data_v1';

const readStorage = <T,>(key: string, fallback: T): T => {
  try {
    if (typeof window === 'undefined') return fallback;
    const saved = window.localStorage.getItem(key);
    if (!saved) return fallback;
    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
};

const writeStorage = (key: string, value: unknown) => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // O app continua funcionando mesmo quando o armazenamento não está disponível.
  }
};

const defaultUser: UserProfile = {
  name: 'Usuário',
  email: 'usuario@exemplo.com',
  salary: 0,
  extraIncome: 0,
  benefits: 0,
  isPremium: false,
  streak: 0,
  lastActive: new Date().toISOString().split('T')[0],
  hasCompletedOnboarding: false,
  theme: 'light',
  militaryMode: false,
  rank: '',
  offlineMode: false
};

export const useStore = () => {
  const [user, setUser] = useState<UserProfile>(() =>
    readStorage<UserProfile>(STORAGE_KEY + '_user', defaultUser)
  );

  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    readStorage<Transaction[]>(STORAGE_KEY + '_transactions', [])
  );

  const [bills, setBills] = useState<FixedBill[]>(() =>
    readStorage<FixedBill[]>(STORAGE_KEY + '_bills', [])
  );

  const [goals, setGoals] = useState<Goal[]>(() =>
    readStorage<Goal[]>(STORAGE_KEY + '_goals', [])
  );

  const [debts, setDebts] = useState<Debt[]>(() =>
    readStorage<Debt[]>(STORAGE_KEY + '_debts', [])
  );

  useEffect(() => {
    writeStorage(STORAGE_KEY + '_user', user);
    writeStorage(STORAGE_KEY + '_transactions', transactions);
    writeStorage(STORAGE_KEY + '_bills', bills);
    writeStorage(STORAGE_KEY + '_goals', goals);
    writeStorage(STORAGE_KEY + '_debts', debts);
  }, [user, transactions, bills, goals, debts]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newT = { ...t, id: Math.random().toString(36).substr(2, 9) };
    setTransactions(prev => [newT, ...prev]);

    const today = new Date().toISOString().split('T')[0];
    if (user.lastActive !== today) {
      setUser(prev => ({ ...prev, streak: prev.streak + 1, lastActive: today }));
    }
  };

  const addBill = (b: Omit<FixedBill, 'id' | 'status'>) => {
    setBills(prev => [
      ...prev,
      { ...b, id: Math.random().toString(36).substr(2, 9), status: 'pending' }
    ]);
  };

  const addGoal = (g: Omit<Goal, 'id' | 'current'>) => {
    setGoals(prev => [
      ...prev,
      { ...g, id: Math.random().toString(36).substr(2, 9), current: 0 }
    ]);
  };

  const addDebt = (d: Omit<Debt, 'id'>) => {
    setDebts(prev => [
      ...prev,
      { ...d, id: Math.random().toString(36).substr(2, 9) }
    ]);
  };

  return {
    user,
    setUser,
    transactions,
    setTransactions,
    addTransaction,
    bills,
    setBills,
    addBill,
    goals,
    setGoals,
    addGoal,
    debts,
    setDebts,
    addDebt
  };
};
