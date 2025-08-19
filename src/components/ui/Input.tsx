import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
}

export function Input({ label, icon: Icon, error, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-slate-400" />
          </div>
        )}
        <input
          className={`
            block w-full rounded-xl border border-slate-200 bg-white/60 backdrop-blur-sm
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 text-slate-900 placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
            transition-all duration-200 hover:bg-white/80
            ${error ? 'border-red-300 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}