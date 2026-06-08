'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthUser {
  id: string;
  phoneNumber: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hydrate from localStorage on mount
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('userId');
    const storedPhone = localStorage.getItem('phoneNumber');

    if (storedToken && storedRole) {
      const hydratedUser = {
        id: storedUserId || '',
        phoneNumber: storedPhone || '',
        role: storedRole,
      };
      setToken(storedToken);
      setUser(hydratedUser);
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newUser.role);
    localStorage.setItem('userId', newUser.id);
    localStorage.setItem('phoneNumber', newUser.phoneNumber);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('phoneNumber');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
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

// Guard component for protected routes
export function ProtectedRoute({ children, allowedRoles }: { children: ReactNode; allowedRoles?: string[] }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/login');
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their correct dashboard
        if (user.role === 'GOV_ADMIN') {
          router.replace('/dashboard/admin');
        } else if (user.role === 'YOUTH_OFFICER') {
          router.replace('/dashboard/youth');
        } else {
          router.replace('/');
        }
      }
    }
  }, [user, isLoading, router, pathname, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-emerald-800 font-mono text-sm tracking-widest animate-pulse">LOADING...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
