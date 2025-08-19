import { useState, useEffect, useMemo } from 'react';
import type { Debt } from '../types';
import { useAuth } from './useAuth';

export function useDebts() {
  const { user } = useAuth();
  const [debts, setDebts] = useState<Debt[]>([]);
  const storageKey = useMemo(() => user ? `budgetflow_debts_${user.id}` : 'budgetflow_debts_guest', [user]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setDebts(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading debts:', error);
      }
    } else {
      // Add sample debts
      const sampleDebts: Debt[] = [
        {
          id: '1',
          creditor: 'Chase Credit Card',
          balance: 3200,
          interestRate: 18.99,
          minimumPayment: 95,
          dueDate: '2024-02-15',
          type: 'Credit Card',
          createdAt: '2024-01-01'
        },
        {
          id: '2',
          creditor: 'Student Loan',
          balance: 12500,
          interestRate: 4.5,
          minimumPayment: 150,
          dueDate: '2024-02-01',
          type: 'Student Loan',
          createdAt: '2024-01-01'
        }
      ];
      setDebts(sampleDebts);
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(debts));
  }, [debts, storageKey]);

  const addDebt = (debt: Omit<Debt, 'id' | 'createdAt'>) => {
    const newDebt: Debt = {
      ...debt,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setDebts(prev => [...prev, newDebt]);
  };

  const updateDebt = (id: string, updates: Partial<Debt>) => {
    setDebts(prev => prev.map(d => 
      d.id === id ? { ...d, ...updates } : d
    ));
  };

  const deleteDebt = (id: string) => {
    setDebts(prev => prev.filter(d => d.id !== id));
  };

  return {
    debts,
    addDebt,
    updateDebt,
    deleteDebt
  };
}