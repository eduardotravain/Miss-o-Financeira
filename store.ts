
import { useState, useEffect } from 'react';
import { UserProfile, Transaction, FixedBill, Goal, Debt } from './types';

const STORAGE_KEY = 'sentinela_data_v1';

export const useStore = () => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_user');
    return saved ? JSON.parse(saved) : {
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
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [bills, setBills] = useState<FixedBill[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_bills');
    return saved ? JSON.parse(saved) : [];
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [debts, setDebts] = useState<Debt[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_debts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_user', JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY + '_transactions', JSON.stringify(transactions));
    localStorage.setItem(STORAGE_KEY + '_bills', JSON.stringify(bills));
    localStorage.setItem(STORAGE_KEY + '_goals', JSON.stringify(goals));
    localStorage.setItem(STORAGE_KEY + '_debts', JSON.stringify(debts));
  }, [user, transactions, bills, goals, debts]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newT = { ...t, id: Math.random().toString(36).substr(2, 9) };
    setTransactions(prev => [newT, ...prev]);
    
    // Streak logic
    const today = new Date().toISOString().split('T')[0];
    if (user.lastActive !== today) {
      setUser(prev => ({ ...prev, streak: prev.streak + 1, lastActive: today }));
    }
  };

  const addBill = (b: Omit<FixedBill, 'id' | 'status'>) => {
    setBills(prev => [...prev, { ...b, id: Math.random().toString(36).substr(2, 9), status: 'pending' }]);
  };

  const addGoal = (g: Omit<Goal, 'id' | 'current'>) => {
    setGoals(prev => [...prev, { ...g, id: Math.random().toString(36).substr(2, 9), current: 0 }]);
  };

  const addDebt = (d: Omit<Debt, 'id'>) => {
    setDebts(prev => [...prev, { ...d, id: Math.random().toString(36).substr(2, 9) }]);
  };

  return {
    user, setUser,
    transactions, setTransactions, addTransaction,
    bills, setBills, addBill,
    goals, setGoals, addGoal,
    debts, setDebts, addDebt
  };
};
