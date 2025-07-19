import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Book, BookFormData } from '../types';
import { BookLinkedList } from '../utils/LinkedList';
import { MongoService } from '../services/mongoService';

interface BookContextType {
  books: Book[];
  linkedList: BookLinkedList;
  isLoading: boolean;
  addBook: (bookData: BookFormData) => Promise<boolean>;
  deleteBook: (bookId: string) => Promise<boolean>;
  updateBook: (bookId: string, updates: Partial<Book>) => Promise<boolean>;
  searchBooks: (query: string) => Book[];
  getBooksByCategory: (category: string) => Book[];
  borrowBook: (bookId: string, userId: string) => Promise<boolean>;
  returnBook: (bookId: string, userId: string) => Promise<boolean>;
  refreshBooks: () => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

interface BookProviderProps {
  children: ReactNode;
}

export const BookProvider: React.FC<BookProviderProps> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [linkedList] = useState(() => new BookLinkedList());
  const [isLoading, setIsLoading] = useState(true);
  const mongoService = MongoService.getInstance();

  // Load books from MongoDB and populate linked list
  const loadBooks = useCallback(async () => {
    try {
      setIsLoading(true);
      const booksFromDB = await mongoService.getAllBooks();
      
      // Clear the linked list and repopulate it
      linkedList.clear();
      booksFromDB.forEach(book => linkedList.addBook(book));
      
      // Update state with books from linked list
      setBooks(linkedList.getAllBooks());
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setIsLoading(false);
    }
  }, [linkedList, mongoService]);

  // Initial load
  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const addBook = async (bookData: BookFormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Add book to MongoDB
      const newBook = await mongoService.addBook({
        ...bookData,
        isAvailable: true,
      });
      
      // Add book to linked list (O(1) operation at the beginning)
      linkedList.addBook(newBook);
      
      // Update state with books from linked list
      setBooks(linkedList.getAllBooks());
      
      // Sync to MongoDB
      await mongoService.syncToMongoDB();
      
      return true;
    } catch (error) {
      console.error('Error adding book:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBook = async (bookId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Delete from MongoDB
      const success = await mongoService.deleteBook(bookId);
      
      if (success) {
        // Remove from linked list
        linkedList.removeBook(bookId);
        
        // Update state with books from linked list
        setBooks(linkedList.getAllBooks());
        
        // Sync to MongoDB
        await mongoService.syncToMongoDB();
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting book:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBook = async (bookId: string, updates: Partial<Book>): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Update in MongoDB
      const updatedBook = await mongoService.updateBook(bookId, updates);
      
      if (updatedBook) {
        // Update in linked list
        linkedList.updateBook(bookId, updates);
        
        // Update state with books from linked list
        setBooks(linkedList.getAllBooks());
        
        // Sync to MongoDB
        await mongoService.syncToMongoDB();
      }
      
      return !!updatedBook;
    } catch (error) {
      console.error('Error updating book:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const searchBooks = (query: string): Book[] => {
    // Use linked list search methods
    const titleResults = linkedList.searchByTitle(query);
    const authorResults = linkedList.searchByAuthor(query);
    
    // Combine and remove duplicates
    const allResults = [...titleResults, ...authorResults];
    const uniqueResults = allResults.filter((book, index, self) => 
      index === self.findIndex(b => b.id === book.id)
    );
    
    return uniqueResults;
  };

  const getBooksByCategory = (category: string): Book[] => {
    return linkedList.getBooksByCategory(category);
  };

  const borrowBook = async (bookId: string, userId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Borrow book in MongoDB
      const success = await mongoService.borrowBook(bookId, userId);
      
      if (success) {
        // Update book in linked list
        linkedList.updateBook(bookId, {
          isAvailable: false,
          borrowedBy: userId,
          borrowedAt: new Date(),
        });
        
        // Update state with books from linked list
        setBooks(linkedList.getAllBooks());
        
        // Sync to MongoDB
        await mongoService.syncToMongoDB();
      }
      
      return success;
    } catch (error) {
      console.error('Error borrowing book:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const returnBook = async (bookId: string, userId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Return book in MongoDB
      const success = await mongoService.returnBook(bookId, userId);
      
      if (success) {
        // Update book in linked list
        linkedList.updateBook(bookId, {
          isAvailable: true,
          borrowedBy: undefined,
          borrowedAt: undefined,
        });
        
        // Update state with books from linked list
        setBooks(linkedList.getAllBooks());
        
        // Sync to MongoDB
        await mongoService.syncToMongoDB();
      }
      
      return success;
    } catch (error) {
      console.error('Error returning book:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBooks = async () => {
    await loadBooks();
  };

  const value: BookContextType = {
    books,
    linkedList,
    isLoading,
    addBook,
    deleteBook,
    updateBook,
    searchBooks,
    getBooksByCategory,
    borrowBook,
    returnBook,
    refreshBooks,
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = (): BookContextType => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
}; 