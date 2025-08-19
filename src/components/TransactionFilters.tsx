import React, { useState, useEffect } from 'react';
import type { Transaction, TransactionCategory } from '../types';
import { Select } from './ui/Select';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { FilterX } from 'lucide-react';

interface TransactionFiltersProps {
  transactions: Transaction[];
  onFilterChange: (filteredTransactions: Transaction[]) => void;
}

const CATEGORIES: TransactionCategory[] = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Investment',
  'Salary',
  'Freelance',
  'Business',
  'Other'
];

export function TransactionFilters({ transactions, onFilterChange }: TransactionFiltersProps) {
  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    let filtered = transactions;

    if (filters.category !== 'all') {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    if (filters.startDate) {
      filtered = filtered.filter(t => t.date >= filters.startDate);
    }

    if (filters.endDate) {
      filtered = filtered.filter(t => t.date <= filters.endDate);
    }

    onFilterChange(filtered);
  }, [filters, transactions, onFilterChange]);

  const clearFilters = () => {
    setFilters({
      category: 'all',
      type: 'all',
      startDate: '',
      endDate: ''
    });
  };

  const hasActiveFilters = filters.category !== 'all' || filters.type !== 'all' || filters.startDate || filters.endDate;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Filter Transactions</h3>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="flex items-center gap-2">
            <FilterX className="w-4 h-4" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Category"
          value={filters.category}
          onChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
          options={[
            { value: 'all', label: 'All Categories' },
            ...CATEGORIES.map(cat => ({ value: cat, label: cat }))
          ]}
        />

        <Select
          label="Type"
          value={filters.type}
          onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
          options={[
            { value: 'all', label: 'All Types' },
            { value: 'income', label: 'Income' },
            { value: 'expense', label: 'Expense' }
          ]}
        />

        <Input
          label="Start Date"
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
        />

        <Input
          label="End Date"
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
        />
      </div>
    </div>
  );
}