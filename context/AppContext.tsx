import React, { createContext, useState, useEffect, useCallback, useContext, ReactNode } from 'react';
import type { UserProfile } from '@/types';
import { mockAvatars } from '@/constants';

type Theme = 'light' | 'dark';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  login: (credentials: { name: string; email: string }) => void;
  logout: () => void;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  const login = useCallback((credentials: { name: string; email: string }) => {
    setUserProfile({
      name: credentials.name,
      email: credentials.email,
      avatarUrl: mockAvatars[Math.floor(Math.random() * mockAvatars.length)],
    });
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUserProfile(null);
  }, []);

  const value = {
    theme,
    toggleTheme,
    isAuthenticated,
    userProfile,
    login,
    logout,
    setUserProfile
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
