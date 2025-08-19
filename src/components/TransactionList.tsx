import React from 'react';
import { Trash2, Edit, TrendingUp, TrendingDown } from 'lucide-react';
import type { Transaction } from '../types';
import { formatCurrency } from '../utils/calculations';
import { Button } from './ui/Button';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onUpdateTransaction: (id: string, transaction: Partial<Transaction>) => void;
}

export function TransactionList({ transactions, onDeleteTransaction }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-800 mb-2">No transactions yet</h3>
        <p className="text-slate-600">Add your first transaction to get started with tracking your finances</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/60">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/30 divide-y divide-slate-200/60">
            {transactions.map((transaction, index) => (
              <tr key={transaction.id} className={`hover:bg-white/50 transition-colors ${
                index % 2 === 0 ? 'bg-white/20' : 'bg-transparent'
              }`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center mr-3
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
                      <div className="text-sm font-medium text-slate-900">
                        {transaction.description}
                      </div>
                      <div className="text-xs text-slate-500 capitalize">
                        {transaction.type}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded-md">
                    {transaction.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className={`text-sm font-semibold ${
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex justify-end space-x-2">
                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDeleteTransaction(transaction.id)}
                      className="p-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}