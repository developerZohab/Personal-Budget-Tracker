import React, { useState } from 'react';
import { Plus, Upload, Filter } from 'lucide-react';
import type { Transaction } from '../types';
import { TransactionForm } from './forms/TransactionForm';
import { TransactionList } from './TransactionList';
import { TransactionFilters } from './TransactionFilters';
import { CSVUpload } from './CSVUpload';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface TransactionManagerProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
  onUpdateTransaction: (id: string, transaction: Partial<Transaction>) => void;
}

export function TransactionManager({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
  onUpdateTransaction
}: TransactionManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);

  React.useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  const handleCSVUpload = (csvTransactions: Transaction[]) => {
    csvTransactions.forEach(transaction => {
      onAddTransaction(transaction);
    });
    setShowUpload(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Transaction Manager</h1>
          <p className="text-slate-600 mt-1">Manage your income and expenses</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
          <TransactionFilters
            transactions={transactions}
            onFilterChange={setFilteredTransactions}
          />
        </div>
      )}

      {/* Transaction List */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden">
        <TransactionList
          transactions={filteredTransactions}
          onDeleteTransaction={onDeleteTransaction}
          onUpdateTransaction={onUpdateTransaction}
        />
      </div>

      {/* Modals */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <TransactionForm
          onSubmit={(transaction) => {
            onAddTransaction(transaction);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <Modal isOpen={showUpload} onClose={() => setShowUpload(false)}>
        <CSVUpload
          onUpload={handleCSVUpload}
          onCancel={() => setShowUpload(false)}
        />
      </Modal>
    </div>
  );
}