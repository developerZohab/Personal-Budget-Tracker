import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

interface StoredUser extends AuthUser {
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USERS_KEY = 'budgetflow_users';
const CURRENT_USER_KEY = 'budgetflow_current_user';

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readCurrentUserId(): string | null {
  try {
    return localStorage.getItem(CURRENT_USER_KEY);
  } catch {
    return null;
  }
}

function writeCurrentUserId(userId: string | null) {
  if (userId) {
    localStorage.setItem(CURRENT_USER_KEY, userId);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const id = readCurrentUserId();
    if (!id) return;
    const stored = readUsers();
    const found = stored.find(u => u.id === id);
    if (found) {
      const { password: _pw, ...safe } = found;
      setUser(safe);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const users = readUsers();
    const match = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!match || match.password !== password) {
      throw new Error('Invalid email or password');
    }
    writeCurrentUserId(match.id);
    const { password: _pw, ...safe } = match;
    setUser(safe);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const users = readUsers();
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error('An account with this email already exists');
    }
    const generateId = () => {
      try {
        return crypto.randomUUID();
      } catch {
        return 'u_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      }
    };
    const newUser: StoredUser = {
      id: generateId(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };
    const updated = [...users, newUser];
    writeUsers(updated);
    writeCurrentUserId(newUser.id);
    const { password: _pw, ...safe } = newUser;
    setUser(safe);
  }, []);

  const signOut = useCallback(() => {
    writeCurrentUserId(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
  }), [user, signIn, signUp, signOut]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


