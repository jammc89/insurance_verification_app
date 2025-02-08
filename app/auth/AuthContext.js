'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutTimerRef = useRef(null);

  // Clear any existing logout timer
  const clearLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
  };

  // Schedule automatic logout when the session expires
  const scheduleLogout = (expirationTime) => {
    const now = new Date().getTime();
    const delay = expirationTime - now;
    if (delay > 0) {
      logoutTimerRef.current = setTimeout(() => {
        logout();
      }, delay);
    } else {
      logout();
    }
  };

  // Log out the user, clear session storage and any timers, then redirect to login
  const logout = () => {
    setUser(null);
    clearLogoutTimer();
    sessionStorage.removeItem('authData');
    router.push('/auth/login');
  };

  // Log in the user and set an expiration time for the session
  const login = (userData) => {
    const expiresAt = new Date().getTime() + SESSION_TIMEOUT_MS;
    const authData = { user: userData, expiresAt };
    setUser(userData);
    sessionStorage.setItem('authData', JSON.stringify(authData));
    scheduleLogout(expiresAt);
  };

  useEffect(() => {
    // On load, check if there is stored auth data and if the session is still valid.
    const storedAuthData = sessionStorage.getItem('authData');
    if (storedAuthData) {
      const { user: storedUser, expiresAt } = JSON.parse(storedAuthData);
      if (new Date().getTime() < expiresAt) {
        setUser(storedUser);
        scheduleLogout(expiresAt);
      } else {
        // Session expired
        sessionStorage.removeItem('authData');
      }
    }
    setLoading(false);

    // Cleanup timer on unmount
    return () => clearLogoutTimer();
  }, []);

  // Helper function to check if the user has the required role
  const hasRole = (requiredRole) => {
    if (!user) return false;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    return user.role === requiredRole;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
