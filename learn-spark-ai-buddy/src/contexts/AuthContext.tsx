
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  onboarded: boolean;
}

// Mock data for demonstration
const MOCK_USER: User = {
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  photoURL: 'https://api.dicebear.com/6.x/avataaars/svg?seed=user-123',
  onboarded: false,
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated (e.g., from localStorage)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, check token validity, etc.
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Mock login function (simulate Google auth)
  const login = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, use mock user
      setUser(MOCK_USER);
      localStorage.setItem('user', JSON.stringify(MOCK_USER));
      toast.success('Signed in successfully');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
      localStorage.removeItem('user');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Sign out failed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
