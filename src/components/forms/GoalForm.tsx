import React, { useState } from 'react';
import { Target, DollarSign, Calendar, FileText } from 'lucide-react';
import type { Goal } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface GoalFormProps {
  onSubmit: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: Partial<Goal>;
}

const GOAL_CATEGORIES = [
  'Emergency Fund',
  'Vacation',
  'Investment',
  'Purchase',
  'Other'
] as const;

export function GoalForm({ onSubmit, onCancel, initialData }: GoalFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    targetAmount: initialData?.targetAmount?.toString() || '',
    currentAmount: initialData?.currentAmount?.toString() || '0',
    targetDate: initialData?.targetDate || '',
    category: initialData?.category || 'Other' as Goal['category']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      description: formData.description,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      targetDate: formData.targetDate,
      category: formData.category
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800">Create New Goal</h3>
        <p className="text-slate-600 mt-2">Set a financial target and track your progress</p>
      </div>

      <Input
        label="Goal Title"
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="e.g., Emergency Fund, Vacation, New Car"
        icon={Target}
        required
      />

      <Input
        label="Description"
        type="text"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Brief description of your goal"
        icon={FileText}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Target Amount"
          type="number"
          step="0.01"
          min="0"
          value={formData.targetAmount}
          onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
          placeholder="0.00"
          icon={DollarSign}
          required
        />

        <Input
          label="Current Amount"
          type="number"
          step="0.01"
          min="0"
          value={formData.currentAmount}
          onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
          placeholder="0.00"
          icon={DollarSign}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Target Date"
          type="date"
          value={formData.targetDate}
          onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
          icon={Calendar}
          required
        />

        <Select
          label="Category"
          value={formData.category}
          onChange={(value) => setFormData({ ...formData, category: value as Goal['category'] })}
          options={GOAL_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
          required
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Create Goal
        </Button>
      </div>
    </form>
  );
}