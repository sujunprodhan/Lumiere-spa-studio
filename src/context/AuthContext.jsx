'use client';

import React, { createContext, useContext, useState } from 'react';
import { SessionProvider, useSession, signOut } from 'next-auth/react';

const AuthContext = createContext({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  session: null,
  status: 'loading',
});

const AuthInnerProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [localUser, setLocalUser] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('lumiere_user');
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const user = session?.user
    ? {
        id: session.user.id || '',
        name: session.user.name,
        email: session.user.email,
        role: session.user.role || 'user',
        image: session.user.image,
      }
    : localUser;

  const isLoading = status === 'loading';

  const login = (userData) => {
    setLocalUser(userData);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('lumiere_user', JSON.stringify(userData));
      } catch (error) {
        console.error('Failed to save user session:', error);
      }
    }
  };

  const logout = async () => {
    setLocalUser(null);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('lumiere_user');
      } catch (error) {
        console.error('Failed to clear user session:', error);
      }
    }
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, session, status }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }) => {
  return (
    <SessionProvider>
      <AuthInnerProvider>{children}</AuthInnerProvider>
    </SessionProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
