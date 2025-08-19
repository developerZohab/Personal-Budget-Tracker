import React from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  Target, 
  Banknote, 
  FileText,
  TrendingUp
} from 'lucide-react';
import type { ActiveTab } from '../App';
import { useAuth } from '../hooks/useAuth';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const navItems = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions' as const, label: 'Transactions', icon: CreditCard },
  { id: 'goals' as const, label: 'Goals', icon: Target },
  { id: 'debts' as const, label: 'Debts', icon: Banknote },
  { id: 'reports' as const, label: 'Reports', icon: FileText },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { user, signOut } = useAuth();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">BudgetFlow</h1>
          </div>
          
          <div className="hidden md:flex space-x-1 bg-slate-100/80 rounded-xl p-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`
                  relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeTab === id
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/60'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:block">{label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-sm text-slate-600">
              {user?.email}
            </div>
            <button
              onClick={signOut}
              className="px-3 py-1.5 text-sm rounded-lg bg-white/70 hover:bg-white text-slate-700 border border-slate-200"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}