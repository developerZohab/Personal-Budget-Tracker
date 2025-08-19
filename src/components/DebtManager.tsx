import React, { useState } from 'react';
import { Plus, CreditCard, AlertTriangle, TrendingDown } from 'lucide-react';
import type { Debt } from '../types';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { DebtForm } from './forms/DebtForm';
import { formatCurrency, calculateDebtPayoff } from '../utils/calculations';

interface DebtManagerProps {
  debts: Debt[];
  onAddDebt: (debt: Omit<Debt, 'id' | 'createdAt'>) => void;
  onUpdateDebt: (id: string, updates: Partial<Debt>) => void;
  onDeleteDebt: (id: string) => void;
}

export function DebtManager({ debts, onAddDebt, onUpdateDebt, onDeleteDebt }: DebtManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [payoffStrategy, setPayoffStrategy] = useState<'snowball' | 'avalanche'>('avalanche');

  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  const averageInterestRate = debts.length > 0 
    ? debts.reduce((sum, debt) => sum + debt.interestRate, 0) / debts.length 
    : 0;

  const getPayoffOrder = () => {
    return [...debts].sort((a, b) => {
      if (payoffStrategy === 'snowball') {
        return a.balance - b.balance; // Smallest balance first
      } else {
        return b.interestRate - a.interestRate; // Highest interest first
      }
    });
  };

  const getDaysUntilDue = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Debt Manager</h1>
          <p className="text-slate-600 mt-1">Track and manage your debts strategically</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Debt
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 mb-2">Total Debt</p>
              <p className="text-2xl font-bold text-red-800">{formatCurrency(totalDebt)}</p>
            </div>
            <div className="w-12 h-12 bg-red-200 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 mb-2">Monthly Payments</p>
              <p className="text-2xl font-bold text-orange-800">{formatCurrency(totalMinimumPayments)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-200 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600 mb-2">Avg. Interest Rate</p>
              <p className="text-2xl font-bold text-yellow-800">{averageInterestRate.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-yellow-200 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Payoff Strategy */}
      {debts.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Payoff Strategy</h3>
            <div className="flex gap-2">
              <Button
                variant={payoffStrategy === 'snowball' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setPayoffStrategy('snowball')}
              >
                Snowball
              </Button>
              <Button
                variant={payoffStrategy === 'avalanche' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setPayoffStrategy('avalanche')}
              >
                Avalanche
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-slate-600 mb-4">
            {payoffStrategy === 'snowball'
              ? 'Pay minimum on all debts, then focus extra payments on the smallest balance first.'
              : 'Pay minimum on all debts, then focus extra payments on the highest interest rate first.'
            }
          </p>

          <div className="space-y-3">
            {getPayoffOrder().map((debt, index) => (
              <div
                key={debt.id}
                className={`p-4 rounded-lg border-2 ${
                  index === 0 
                    ? 'border-emerald-300 bg-emerald-50' 
                    : 'border-slate-200 bg-white/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${index === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'}
                      `}>
                        {index + 1}
                      </span>
                      <span className="font-medium text-slate-800">{debt.creditor}</span>
                      {index === 0 && (
                        <span className="px-2 py-1 bg-emerald-600 text-white text-xs rounded-md font-medium">
                          Focus Here
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                      {debt.type} • {debt.interestRate}% APR • Minimum: {formatCurrency(debt.minimumPayment)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">{formatCurrency(debt.balance)}</p>
                    <p className="text-xs text-slate-500">
                      Due: {new Date(debt.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debt List */}
      {debts.length > 0 ? (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200/60">
            <h3 className="text-lg font-semibold text-slate-800">Your Debts</h3>
          </div>
          <div className="divide-y divide-slate-200/60">
            {debts.map((debt) => {
              const daysUntilDue = getDaysUntilDue(debt.dueDate);
              const payoffInfo = calculateDebtPayoff(debt.balance, debt.interestRate, debt.minimumPayment);
              const isOverdue = daysUntilDue < 0;
              const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 7;

              return (
                <div key={debt.id} className="p-6 hover:bg-white/60 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-slate-800">{debt.creditor}</h4>
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md font-medium">
                          {debt.type}
                        </span>
                        {(isOverdue || isDueSoon) && (
                          <span className={`px-2 py-1 text-xs rounded-md font-medium ${
                            isOverdue 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {isOverdue ? 'Overdue' : 'Due Soon'}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500">Balance</p>
                          <p className="font-semibold text-slate-800">{formatCurrency(debt.balance)}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Interest Rate</p>
                          <p className="font-semibold text-slate-800">{debt.interestRate}%</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Monthly Payment</p>
                          <p className="font-semibold text-slate-800">{formatCurrency(debt.minimumPayment)}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Next Due</p>
                          <p className={`font-semibold ${
                            isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-slate-800'
                          }`}>
                            {new Date(debt.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-600 mb-1">Payoff Timeline (minimum payments):</p>
                        {Number.isFinite(payoffInfo.months) ? (
                          <p className="text-sm">
                            <span className="font-semibold text-slate-800">{payoffInfo.months} months</span>
                            <span className="text-slate-600"> • Total Interest: </span>
                            <span className="font-semibold text-red-600">{formatCurrency(payoffInfo.totalInterest)}</span>
                          </p>
                        ) : (
                          <p className="text-sm text-orange-600">
                            Minimum payment does not cover monthly interest. Increase payment to start reducing balance.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const payment = prompt('Enter payment amount:');
                          if (payment && !isNaN(parseFloat(payment))) {
                            const paymentAmount = parseFloat(payment);
                            onUpdateDebt(debt.id, {
                              balance: Math.max(0, debt.balance - paymentAmount)
                            });
                          }
                        }}
                      >
                        Make Payment
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onDeleteDebt(debt.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">No debts tracked</h3>
          <p className="text-slate-600 mb-4">Add your debts to create a strategic payoff plan</p>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Your First Debt
          </Button>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <DebtForm
          onSubmit={(debt) => {
            onAddDebt(debt);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  );
}