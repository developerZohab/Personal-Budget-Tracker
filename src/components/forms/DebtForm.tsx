import React, { useState } from 'react';
import { CreditCard, DollarSign, Percent, Calendar, Building } from 'lucide-react';
import type { Debt } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface DebtFormProps {
  onSubmit: (debt: Omit<Debt, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: Partial<Debt>;
}

const DEBT_TYPES = [
  'Credit Card',
  'Personal Loan',
  'Student Loan',
  'Mortgage',
  'Other'
] as const;

export function DebtForm({ onSubmit, onCancel, initialData }: DebtFormProps) {
  const [formData, setFormData] = useState({
    creditor: initialData?.creditor || '',
    balance: initialData?.balance?.toString() || '',
    interestRate: initialData?.interestRate?.toString() || '',
    minimumPayment: initialData?.minimumPayment?.toString() || '',
    dueDate: initialData?.dueDate || '',
    type: initialData?.type || 'Credit Card' as Debt['type']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      creditor: formData.creditor,
      balance: parseFloat(formData.balance),
      interestRate: parseFloat(formData.interestRate),
      minimumPayment: parseFloat(formData.minimumPayment),
      dueDate: formData.dueDate,
      type: formData.type
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800">Add New Debt</h3>
        <p className="text-slate-600 mt-2">Track your debt to create a payoff strategy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Creditor Name"
          type="text"
          value={formData.creditor}
          onChange={(e) => setFormData({ ...formData, creditor: e.target.value })}
          placeholder="e.g., Chase Credit Card"
          icon={Building}
          required
        />
        
        <Select
          label="Debt Type"
          value={formData.type}
          onChange={(value) => setFormData({ ...formData, type: value as Debt['type'] })}
          options={DEBT_TYPES.map(type => ({ value: type, label: type }))}
          icon={CreditCard}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Current Balance"
          type="number"
          step="0.01"
          min="0"
          value={formData.balance}
          onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
          placeholder="0.00"
          icon={DollarSign}
          required
        />

        <Input
          label="Interest Rate (%)"
          type="number"
          step="0.01"
          min="0"
          max="100"
          value={formData.interestRate}
          onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
          placeholder="18.99"
          icon={Percent}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Minimum Payment"
          type="number"
          step="0.01"
          min="0"
          value={formData.minimumPayment}
          onChange={(e) => setFormData({ ...formData, minimumPayment: e.target.value })}
          placeholder="95.00"
          icon={DollarSign}
          required
        />

        <Input
          label="Next Due Date"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          icon={Calendar}
          required
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Add Debt
        </Button>
      </div>
    </form>
  );
}