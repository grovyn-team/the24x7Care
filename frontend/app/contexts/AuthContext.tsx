'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../lib/api';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'doctor';
  doctorId?: string | null;
}

interface AuthSessionResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
    doctorId?: string | null;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  applySession: (session: AuthSessionResponse, redirectTo?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDoctor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = authApi.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const applySession = (response: AuthSessionResponse, redirectTo?: string) => {
    authApi.setAuth(response.access_token, response.user);
    setUser({
      ...response.user,
      role: response.user.role as 'admin' | 'doctor',
    });
    if (redirectTo) {
      router.push(redirectTo);
      return;
    }
    if (response.user.role === 'admin') {
      router.push('/admin/dashboard');
    } else if (response.user.role === 'doctor') {
      router.push('/doctor/dashboard');
    } else {
      router.push('/admin/dashboard');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      applySession(response);
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = () => {
    const currentRole = user?.role;
    authApi.logout();
    setUser(null);
    if (currentRole === 'doctor') {
      router.push('/doctor/login');
    } else {
      router.push('/admin/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        applySession,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isDoctor: user?.role === 'doctor',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
