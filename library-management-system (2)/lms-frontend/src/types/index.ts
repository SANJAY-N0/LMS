// Core types for the Library Management System

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  isAvailable: boolean;
  borrowedBy?: string;
  borrowedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  borrowedBooks: string[]; // Array of book IDs
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  category: string;
}

export interface SearchFilters {
  title?: string;
  author?: string;
  category?: string;
  isAvailable?: boolean;
} 