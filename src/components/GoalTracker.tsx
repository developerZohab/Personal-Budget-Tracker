import React, { useState } from 'react';
import { Plus, Target, Calendar, DollarSign } from 'lucide-react';
import type { Goal, Transaction } from '../types';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { GoalForm } from './forms/GoalForm';
import { formatCurrency } from '../utils/calculations';

interface GoalTrackerProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  onUpdateGoal: (id: string, updates: Partial<Goal>) => void;
  onDeleteGoal: (id: string) => void;
  transactions: Transaction[];
}

export function GoalTracker({ goals, onAddGoal, onUpdateGoal, onDeleteGoal }: GoalTrackerProps) {
  const [showForm, setShowForm] = useState(false);

  const getProgressPercentage = (goal: Goal): number => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getDaysRemaining = (targetDate: string): number => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Goal Tracker</h1>
          <p className="text-slate-600 mt-1">Set and track your financial goals</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </Button>
      </div>

      {/* Goals Grid */}
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = getProgressPercentage(goal);
            const daysRemaining = getDaysRemaining(goal.targetDate);
            const isCompleted = progress >= 100;
            const isOverdue = daysRemaining < 0 && !isCompleted;

            return (
              <div
                key={goal.id}
                className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Goal Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
                      {goal.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">{goal.description}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-600">Progress</span>
                    <span className={`text-sm font-semibold ${
                      isCompleted ? 'text-emerald-600' : 'text-slate-800'
                    }`}>
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        isCompleted
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                          : 'bg-gradient-to-r from-blue-500 to-blue-400'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Goal Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <DollarSign className="w-4 h-4" />
                      <span>Current / Target</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-800">
                        {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatCurrency(goal.targetAmount - goal.currentAmount)} remaining
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>Target Date</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-800">
                        {new Date(goal.targetDate).toLocaleDateString()}
                      </div>
                      <div className={`text-xs ${
                        isCompleted
                          ? 'text-emerald-600'
                          : isOverdue
                          ? 'text-red-600'
                          : daysRemaining <= 30
                          ? 'text-orange-600'
                          : 'text-slate-500'
                      }`}>
                        {isCompleted
                          ? 'Completed!'
                          : isOverdue
                          ? `${Math.abs(daysRemaining)} days overdue`
                          : `${daysRemaining} days remaining`
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const amount = prompt('Add amount to goal:');
                      if (amount && !isNaN(parseFloat(amount))) {
                        onUpdateGoal(goal.id, {
                          currentAmount: goal.currentAmount + parseFloat(amount)
                        });
                      }
                    }}
                    className="flex-1"
                  >
                    Add Funds
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDeleteGoal(goal.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">No goals yet</h3>
          <p className="text-slate-600 mb-4">Set your first financial goal to start tracking your progress</p>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Your First Goal
          </Button>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <GoalForm
          onSubmit={(goal) => {
            onAddGoal(goal);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  );
}