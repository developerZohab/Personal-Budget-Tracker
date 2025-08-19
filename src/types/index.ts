export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: TransactionCategory;
  type: 'income' | 'expense';
}

export type TransactionCategory = 
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills & Utilities'
  | 'Healthcare'
  | 'Education'
  | 'Travel'
  | 'Investment'
  | 'Salary'
  | 'Freelance'
  | 'Business'
  | 'Other';

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: 'Emergency Fund' | 'Vacation' | 'Investment' | 'Purchase' | 'Other';
  createdAt: string;
}

export interface Debt {
  id: string;
  creditor: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  dueDate: string;
  type: 'Credit Card' | 'Personal Loan' | 'Student Loan' | 'Mortgage' | 'Other';
  createdAt: string;
}

export interface FilterOptions {
  category?: TransactionCategory;
  type?: 'income' | 'expense' | 'all';
  dateRange?: {
    start: string;
    end: string;
  };
}