import { useState, useEffect, useMemo } from 'react';
import type { Goal } from '../types';
import { useAuth } from './useAuth';

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const storageKey = useMemo(() => user ? `budgetflow_goals_${user.id}` : 'budgetflow_goals_guest', [user]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setGoals(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading goals:', error);
      }
    } else {
      // Add sample goals
      const sampleGoals: Goal[] = [
        {
          id: '1',
          title: 'Emergency Fund',
          description: '6 months of expenses for financial security',
          targetAmount: 15000,
          currentAmount: 8500,
          targetDate: '2024-12-31',
          category: 'Emergency Fund',
          createdAt: '2024-01-01'
        },
        {
          id: '2',
          title: 'Summer Vacation',
          description: 'Trip to Europe with family',
          targetAmount: 5000,
          currentAmount: 2100,
          targetDate: '2024-06-01',
          category: 'Vacation',
          createdAt: '2024-01-01'
        }
      ];
      setGoals(sampleGoals);
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(goals));
  }, [goals, storageKey]);

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => 
      g.id === id ? { ...g, ...updates } : g
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal
  };
}