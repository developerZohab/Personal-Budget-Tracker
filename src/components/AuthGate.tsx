import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthScreen } from './auth/AuthScreen';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <AuthScreen />;
  return <>{children}</>;
}


