'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient, ApiError } from '@/lib/api-client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'recycler' | 'admin' | string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  refreshUser: () => Promise<AuthUser | null>;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async (): Promise<AuthUser | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const currentUser = await apiClient<AuthUser>('/auth/me');
      setUser(currentUser);
      return currentUser;
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        // Hanya hapus user jika server benar-benar merespon 401 Unauthorized
        setUser(null);
      } else {
        // Jika network error / 500, jangan langsung hapus user agar tidak bouncing
        const msg = err instanceof Error ? err.message : 'Gagal menghubungi server';
        setError(msg);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();

    const handleAuthEvent = () => {
      refreshUser();
    };

    window.addEventListener('recynect-auth-changed', handleAuthEvent);
    return () => {
      window.removeEventListener('recynect-auth-changed', handleAuthEvent);
    };
  }, [refreshUser]);

  const logout = async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch {
      // Abaikan error saat proses logout
    } finally {
      setUser(null);
      setError(null);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('recynect-auth-changed'));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        error,
        refreshUser,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

