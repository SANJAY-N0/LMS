import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, AuthContextType } from '../types';
import { MongoService } from '../services/mongoService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mongoService = MongoService.getInstance();

  // Check for stored user session on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('lms_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('lms_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email
      const foundUser = await mongoService.findUserByEmail(credentials.email);
      
      if (!foundUser) {
        throw new Error('User not found');
      }

      // In a real application, you would verify the password here
      // For demo purposes, we'll accept any password for existing users
      // or create a new user if the email doesn't exist
      
      if (foundUser) {
        // Store user in localStorage for persistence
        localStorage.setItem('lms_user', JSON.stringify(foundUser));
        setUser(foundUser);
        return true;
      } else {
        // Create a new user if not found (demo feature)
        const newUser: User = {
          id: Date.now().toString(),
          name: credentials.email.split('@')[0], // Use email prefix as name
          email: credentials.email,
          role: 'user',
          borrowedBooks: [],
        };
        
        localStorage.setItem('lms_user', JSON.stringify(newUser));
        setUser(newUser);
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('lms_user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 