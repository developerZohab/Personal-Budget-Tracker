import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { TransactionManager } from './components/TransactionManager';
import { GoalTracker } from './components/GoalTracker';
import { DebtManager } from './components/DebtManager';
import { Reports } from './components/Reports';
import { Navigation } from './components/Navigation';
import { useTransactions } from './hooks/useTransactions';
import { useGoals } from './hooks/useGoals';
import { useDebts } from './hooks/useDebts';
// Auth is now provided at the root in main.tsx

export type ActiveTab = 'dashboard' | 'transactions' | 'goals' | 'debts' | 'reports';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const { transactions, addTransaction, deleteTransaction, updateTransaction } = useTransactions();
  const { goals, addGoal, updateGoal, deleteGoal } = useGoals();
  const { debts, addDebt, updateDebt, deleteDebt } = useDebts();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} goals={goals} debts={debts} />;
      case 'transactions':
        return (
          <TransactionManager
            transactions={transactions}
            onAddTransaction={addTransaction}
            onDeleteTransaction={deleteTransaction}
            onUpdateTransaction={updateTransaction}
          />
        );
      case 'goals':
        return (
          <GoalTracker
            goals={goals}
            onAddGoal={addGoal}
            onUpdateGoal={updateGoal}
            onDeleteGoal={deleteGoal}
            transactions={transactions}
          />
        );
      case 'debts':
        return (
          <DebtManager
            debts={debts}
            onAddDebt={addDebt}
            onUpdateDebt={updateDebt}
            onDeleteDebt={deleteDebt}
          />
        );
      case 'reports':
        return <Reports transactions={transactions} goals={goals} debts={debts} />;
      default:
        return <Dashboard transactions={transactions} goals={goals} debts={debts} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
}

export default App;