import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { Transaction } from '../types';
import { formatCurrency } from '../utils/calculations';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <p>No transactions yet</p>
        <p className="text-sm">Add your first transaction to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-3 bg-white/40 rounded-lg hover:bg-white/60 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className={`
              w-10 h-10 rounded-lg flex items-center justify-center
              ${transaction.type === 'income' 
                ? 'bg-emerald-100 text-emerald-600' 
                : 'bg-red-100 text-red-600'
              }
            `}>
              {transaction.type === 'income' ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="font-medium text-slate-800">{transaction.description}</p>
              <p className="text-sm text-slate-500">
                {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className={`text-lg font-semibold ${
            transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}