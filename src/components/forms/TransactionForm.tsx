import React, { useState } from 'react';
import { Calendar, DollarSign, Tag, FileText } from 'lucide-react';
import type { Transaction, TransactionCategory } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
  initialData?: Partial<Transaction>;
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

export function TransactionForm({ onSubmit, onCancel, initialData }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    description: initialData?.description || '',
    amount: initialData?.amount?.toString() || '',
    category: initialData?.category || 'Other' as TransactionCategory,
    type: initialData?.type || 'expense' as 'income' | 'expense'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date: formData.date,
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800">Add Transaction</h3>
        <p className="text-slate-600 mt-2">Record a new income or expense</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          icon={Calendar}
          required
        />
        
        <Select
          label="Type"
          value={formData.type}
          onChange={(value) => setFormData({ ...formData, type: value as 'income' | 'expense' })}
          options={[
            { value: 'income', label: 'Income' },
            { value: 'expense', label: 'Expense' }
          ]}
          required
        />
      </div>

      <Input
        label="Description"
        type="text"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Enter transaction description"
        icon={FileText}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Amount"
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="0.00"
          icon={DollarSign}
          required
        />

        <Select
          label="Category"
          value={formData.category}
          onChange={(value) => setFormData({ ...formData, category: value as TransactionCategory })}
          options={CATEGORIES.map(cat => ({ value: cat, label: cat }))}
          icon={Tag}
          required
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Add Transaction
        </Button>
      </div>
    </form>
  );
}