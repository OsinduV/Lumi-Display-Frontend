import React, { createContext, useContext, useState, useEffect } from 'react';
import { USERS } from '@/config/auth.config';

interface User {
  username: string;
  role: 'admin' | 'salesperson';
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  canViewPrices: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user_session');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user_session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: { username: string; password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check against multiple users
    const user = Object.values(USERS).find(u => 
      u.username === credentials.username && u.password === credentials.password
    );
    
    if (user) {
      const userData: User = {
        username: user.username,
        role: user.role,
        fullName: user.fullName
      };
      
      setUser(userData);
      localStorage.setItem('user_session', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    } else {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_session');
  };

  const canViewPrices = !!user && (user.role === 'admin' || user.role === 'salesperson');

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
    canViewPrices
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
