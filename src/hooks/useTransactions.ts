import { useState, useEffect, useMemo } from 'react';
import type { Transaction } from '../types';
import { useAuth } from './useAuth';

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const storageKey = useMemo(() => user ? `budgetflow_transactions_${user.id}` : 'budgetflow_transactions_guest', [user]);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading transactions:', error);
      }
    } else {
      // Add some sample data
      const sampleTransactions: Transaction[] = [
        {
          id: '1',
          date: '2024-01-15',
          description: 'Salary Payment',
          amount: 5000,
          category: 'Salary',
          type: 'income'
        },
        {
          id: '2',
          date: '2024-01-16',
          description: 'Grocery Shopping',
          amount: 125.50,
          category: 'Food & Dining',
          type: 'expense'
        },
        {
          id: '3',
          date: '2024-01-17',
          description: 'Gas Station',
          amount: 65.00,
          category: 'Transportation',
          type: 'expense'
        },
        {
          id: '4',
          date: '2024-01-18',
          description: 'Netflix Subscription',
          amount: 15.99,
          category: 'Entertainment',
          type: 'expense'
        }
      ];
      setTransactions(sampleTransactions);
    }
  }, [storageKey]);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(transactions));
  }, [transactions, storageKey]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction
  };
}