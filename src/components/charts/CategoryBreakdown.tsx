import React from 'react';
import type { Transaction } from '../../types';
import { calculateCategorySpending } from '../../utils/calculations';

interface CategoryBreakdownProps {
  transactions: Transaction[];
}

const COLORS = [
  'bg-emerald-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-pink-500',
  'bg-indigo-500'
];

export function CategoryBreakdown({ transactions }: CategoryBreakdownProps) {
  const categoryData = calculateCategorySpending(transactions);
  const total = Object.values(categoryData).reduce((sum, amount) => sum + amount, 0);
  const categories = Object.entries(categoryData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  return (
    <div className="space-y-4">
      {categories.length > 0 ? (
        <>
          {/* Progress bars */}
          <div className="space-y-3">
            {categories.map(([category, amount], index) => {
              const percentage = (amount / total) * 100;
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 font-medium">{category}</span>
                    <span className="text-slate-800 font-semibold">${amount.toFixed(0)}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`${COLORS[index]} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-500">{percentage.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex flex-wrap gap-2">
              {categories.map(([category], index) => (
                <div key={category} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${COLORS[index]}`} />
                  <span className="text-xs text-slate-600">{category}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-64 text-slate-500">
          <p>No expense data available</p>
        </div>
      )}
    </div>
  );
}