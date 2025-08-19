import React from 'react';
import { TrendingUp, TrendingDown, Target, CreditCard } from 'lucide-react';
import type { Transaction, Goal, Debt } from '../types';
import { calculateMonthlySpending, calculateTotalIncome, calculateTotalExpenses } from '../utils/calculations';
import { SpendingChart } from './charts/SpendingChart';
import { CategoryBreakdown } from './charts/CategoryBreakdown';
import { RecentTransactions } from './RecentTransactions';

interface DashboardProps {
  transactions: Transaction[];
  goals: Goal[];
  debts: Debt[];
}

export function Dashboard({ transactions, goals, debts }: DashboardProps) {
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const netWorth = totalIncome - totalExpenses;
  const monthlySpending = calculateMonthlySpending(transactions);

  const totalGoalProgress = goals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount) * 100, 0) / (goals.length || 1);
  const totalDebtBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);

  const stats = [
    {
      title: 'Total Income',
      value: `$${totalIncome.toLocaleString()}`,
      change: '+12%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'emerald'
    },
    {
      title: 'Total Expenses',
      value: `$${totalExpenses.toLocaleString()}`,
      change: '-5%',
      changeType: 'negative' as const,
      icon: TrendingDown,
      color: 'red'
    },
    {
      title: 'Goal Progress',
      value: `${totalGoalProgress.toFixed(1)}%`,
      change: `${goals.length} active`,
      changeType: 'neutral' as const,
      icon: Target,
      color: 'blue'
    },
    {
      title: 'Total Debt',
      value: `$${totalDebtBalance.toLocaleString()}`,
      change: `${debts.length} debts`,
      changeType: 'negative' as const,
      icon: CreditCard,
      color: 'orange'
    }
  ];

  const colorMap = {
    emerald: 'from-emerald-500 to-emerald-600',
    red: 'from-red-500 to-red-600',
    blue: 'from-blue-500 to-blue-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Financial Dashboard</h1>
        <p className="text-slate-600">Track your financial progress and achieve your goals</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative overflow-hidden bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className={`text-xs mt-1 ${
                  stat.changeType === 'positive' ? 'text-emerald-600' :
                  stat.changeType === 'negative' ? 'text-red-600' :
                  'text-slate-500'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[stat.color]} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Monthly Spending Trend</h3>
          <SpendingChart transactions={transactions} />
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Spending by Category</h3>
          <CategoryBreakdown transactions={transactions} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Transactions</h3>
        <RecentTransactions transactions={transactions.slice(0, 5)} />
      </div>
    </div>
  );
}