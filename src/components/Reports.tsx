import React, { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, PieChart, Target } from 'lucide-react';
import type { Transaction, Goal, Debt } from '../types';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { 
  calculateTotalIncome, 
  calculateTotalExpenses, 
  calculateCategorySpending,
  formatCurrency 
} from '../utils/calculations';

interface ReportsProps {
  transactions: Transaction[];
  goals: Goal[];
  debts: Debt[];
}

type ReportPeriod = 'all' | 'ytd' | 'last12' | 'last30';

export function Reports({ transactions, goals, debts }: ReportsProps) {
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('ytd');

  const getFilteredTransactions = () => {
    const now = new Date();
    const cutoffDate = (() => {
      switch (reportPeriod) {
        case 'ytd':
          return new Date(now.getFullYear(), 0, 1);
        case 'last12':
          return new Date(now.setMonth(now.getMonth() - 12));
        case 'last30':
          return new Date(now.setDate(now.getDate() - 30));
        default:
          return new Date(0);
      }
    })();

    return transactions.filter(t => new Date(t.date) >= cutoffDate);
  };

  const filteredTransactions = getFilteredTransactions();
  const totalIncome = calculateTotalIncome(filteredTransactions);
  const totalExpenses = calculateTotalExpenses(filteredTransactions);
  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;
  const categorySpending = calculateCategorySpending(filteredTransactions);

  const totalGoalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalGoalProgress = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalDebtBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);

  const generateReport = () => {
    const reportData = {
      period: reportPeriod,
      dateGenerated: new Date().toISOString(),
      summary: {
        totalIncome,
        totalExpenses,
        netIncome,
        savingsRate,
        totalTransactions: filteredTransactions.length
      },
      goals: {
        totalGoals: goals.length,
        totalTarget: totalGoalTarget,
        totalProgress: totalGoalProgress,
        progressPercentage: totalGoalTarget > 0 ? (totalGoalProgress / totalGoalTarget) * 100 : 0
      },
      debts: {
        totalDebts: debts.length,
        totalBalance: totalDebtBalance,
        totalMinimumPayments
      },
      categoryBreakdown: categorySpending
    };

    // Create downloadable report
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-report-${reportPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const periodLabels = {
    all: 'All Time',
    ytd: 'Year to Date',
    last12: 'Last 12 Months',
    last30: 'Last 30 Days'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Financial Reports</h1>
          <p className="text-slate-600 mt-1">Comprehensive analysis of your financial data</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            label=""
            value={reportPeriod}
            onChange={(value) => setReportPeriod(value as ReportPeriod)}
            options={[
              { value: 'all', label: 'All Time' },
              { value: 'ytd', label: 'Year to Date' },
              { value: 'last12', label: 'Last 12 Months' },
              { value: 'last30', label: 'Last 30 Days' }
            ]}
          />
          <Button onClick={generateReport} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Report Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Financial Report</h2>
            <p className="text-emerald-100">{periodLabels[reportPeriod]} • Generated {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-emerald-200 text-sm">Total Income</p>
            <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
          </div>
          <div>
            <p className="text-emerald-200 text-sm">Total Expenses</p>
            <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
          </div>
          <div>
            <p className="text-emerald-200 text-sm">Net Income</p>
            <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-white' : 'text-red-300'}`}>
              {formatCurrency(netIncome)}
            </p>
          </div>
          <div>
            <p className="text-emerald-200 text-sm">Savings Rate</p>
            <p className="text-2xl font-bold">{savingsRate.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Report Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income & Expense Analysis */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-slate-800">Income & Expenses</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
              <span className="text-slate-700">Total Income</span>
              <span className="font-semibold text-emerald-600">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-slate-700">Total Expenses</span>
              <span className="font-semibold text-red-600">{formatCurrency(totalExpenses)}</span>
            </div>
            <div className={`flex justify-between items-center p-3 rounded-lg ${
              netIncome >= 0 ? 'bg-green-50' : 'bg-orange-50'
            }`}>
              <span className="text-slate-700">Net Income</span>
              <span className={`font-semibold ${
                netIncome >= 0 ? 'text-green-600' : 'text-orange-600'
              }`}>
                {formatCurrency(netIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-slate-700">Savings Rate</span>
              <span className="font-semibold text-blue-600">{savingsRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
          <div className="flex items-center gap-3 mb-4">
            <PieChart className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-800">Spending by Category</h3>
          </div>
          
          <div className="space-y-3">
            {Object.entries(categorySpending)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([category, amount]) => {
                const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">{category}</span>
                      <div className="text-right">
                        <span className="font-semibold text-slate-800">{formatCurrency(amount)}</span>
                        <span className="text-slate-500 ml-2">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Goals Overview */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-slate-800">Goals Progress</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-slate-700">Total Goals</span>
              <span className="font-semibold text-purple-600">{goals.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-slate-700">Target Amount</span>
              <span className="font-semibold text-purple-600">{formatCurrency(totalGoalTarget)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-slate-700">Progress</span>
              <span className="font-semibold text-purple-600">
                {formatCurrency(totalGoalProgress)} ({totalGoalTarget > 0 ? ((totalGoalProgress / totalGoalTarget) * 100).toFixed(1) : 0}%)
              </span>
            </div>
          </div>
        </div>

        {/* Debt Summary */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-slate-800">Debt Summary</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-slate-700">Total Debts</span>
              <span className="font-semibold text-red-600">{debts.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-slate-700">Total Balance</span>
              <span className="font-semibold text-red-600">{formatCurrency(totalDebtBalance)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-slate-700">Monthly Payments</span>
              <span className="font-semibold text-red-600">{formatCurrency(totalMinimumPayments)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Financial Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {netIncome > 0 && (
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-emerald-800 font-medium">Positive Cash Flow</p>
              <p className="text-emerald-600 text-sm mt-1">
                You're saving {formatCurrency(netIncome)} this period. Great work!
              </p>
            </div>
          )}
          
          {savingsRate >= 20 && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 font-medium">Excellent Savings Rate</p>
              <p className="text-green-600 text-sm mt-1">
                Your {savingsRate.toFixed(1)}% savings rate exceeds the recommended 20%.
              </p>
            </div>
          )}
          
          {totalDebtBalance > 0 && totalMinimumPayments / totalIncome > 0.4 && (
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-orange-800 font-medium">High Debt-to-Income Ratio</p>
              <p className="text-orange-600 text-sm mt-1">
                Consider debt consolidation or accelerated payoff strategies.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}