import type { Transaction } from '../types';

export function calculateTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateMonthlySpending(transactions: Transaction[]): Record<string, number> {
  const monthly: Record<string, number> = {};
  
  transactions.forEach(transaction => {
    if (transaction.type === 'expense') {
      const month = transaction.date.substring(0, 7); // YYYY-MM
      monthly[month] = (monthly[month] || 0) + transaction.amount;
    }
  });
  
  return monthly;
}

export function calculateCategorySpending(transactions: Transaction[]): Record<string, number> {
  const categories: Record<string, number> = {};
  
  transactions.forEach(transaction => {
    if (transaction.type === 'expense') {
      categories[transaction.category] = (categories[transaction.category] || 0) + transaction.amount;
    }
  });
  
  return categories;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export function calculateDebtPayoff(balance: number, interestRate: number, monthlyPayment: number) {
  const monthlyRate = interestRate / 100 / 12;
  if (monthlyPayment <= 0) {
    return {
      months: Infinity,
      totalInterest: Infinity,
      totalPayment: Infinity
    };
  }
  // Handle zero interest separately
  if (monthlyRate === 0) {
    const months = Math.ceil(balance / monthlyPayment);
    const totalPayment = months * monthlyPayment;
    const totalInterest = Math.max(0, totalPayment - balance);
    return {
      months,
      totalInterest,
      totalPayment
    };
  }
  // If payment is not enough to cover monthly interest, payoff is impossible
  if (monthlyPayment <= balance * monthlyRate) {
    return {
      months: Infinity,
      totalInterest: Infinity,
      totalPayment: Infinity
    };
  }
  const monthsExact = -Math.log(1 - (monthlyRate * balance) / monthlyPayment) / Math.log(1 + monthlyRate);
  const months = Math.ceil(monthsExact);
  const totalPayment = months * monthlyPayment;
  const totalInterest = Math.max(0, totalPayment - balance);
  return {
    months,
    totalInterest,
    totalPayment
  };
}