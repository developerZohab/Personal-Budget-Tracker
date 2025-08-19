import React from 'react';
import type { Transaction } from '../../types';
import { calculateMonthlySpending } from '../../utils/calculations';

interface SpendingChartProps {
  transactions: Transaction[];
}

export function SpendingChart({ transactions }: SpendingChartProps) {
  const monthlyData = calculateMonthlySpending(transactions);
  const months = Object.keys(monthlyData).sort();
  const amounts = Object.values(monthlyData);
  const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 0;

  return (
    <div className="space-y-4">
      {maxAmount > 0 && (
        <div className="h-64 flex items-end justify-between space-x-2">
          {months.slice(-6).map((month) => {
            const amount = monthlyData[month];
            const height = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
            const monthName = new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' });
            
            return (
              <div key={month} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col justify-end h-48">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-500 hover:from-emerald-600 hover:to-emerald-500"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-slate-600 font-medium">{monthName}</div>
                <div className="text-xs text-slate-500">${amount.toFixed(0)}</div>
              </div>
            );
          })}
        </div>
      )}
      
      {(months.length === 0 || maxAmount === 0) && (
        <div className="flex items-center justify-center h-64 text-slate-500">
          <p>No expense data available</p>
        </div>
      )}
    </div>
  );
}