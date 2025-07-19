import { Book } from '../types';

// Node class for the linked list
class BookNode {
  data: Book;
  next: BookNode | null;

  constructor(book: Book) {
    this.data = book;
    this.next = null;
  }
}

/**
 * Linked List implementation for managing books in order
 * This provides O(1) insertion at the beginning and O(n) for other operations
 * Books are maintained in chronological order (newest first)
 */
export class BookLinkedList {
  private head: BookNode | null;
  private size: number;

  constructor() {
    this.head = null;
    this.size = 0;
  }

  /**
   * Add a new book at the beginning of the list (O(1) operation)
   * This maintains books in reverse chronological order (newest first)
   */
  addBook(book: Book): void {
    const newNode = new BookNode(book);
    newNode.next = this.head;
    this.head = newNode;
    this.size++;
  }

  /**
   * Remove a book by ID from the linked list
   * Returns true if book was found and removed, false otherwise
   */
  removeBook(bookId: string): boolean {
    if (!this.head) return false;

    // If head is the book to remove
    if (this.head.data.id === bookId) {
      this.head = this.head.next;
      this.size--;
      return true;
    }

    // Search for the book in the rest of the list
    let current = this.head;
    while (current.next) {
      if (current.next.data.id === bookId) {
        current.next = current.next.next;
        this.size--;
        return true;
      }
      current = current.next;
    }

    return false;
  }

  /**
   * Find a book by ID in the linked list
   * Returns the book if found, null otherwise
   */
  findBook(bookId: string): Book | null {
    let current = this.head;
    while (current) {
      if (current.data.id === bookId) {
        return current.data;
      }
      current = current.next;
    }
    return null;
  }

  /**
   * Search books by title (case-insensitive)
   * Returns an array of matching books
   */
  searchByTitle(title: string): Book[] {
    const results: Book[] = [];
    let current = this.head;
    const searchTerm = title.toLowerCase();

    while (current) {
      if (current.data.title.toLowerCase().includes(searchTerm)) {
        results.push(current.data);
      }
      current = current.next;
    }

    return results;
  }

  /**
   * Search books by author (case-insensitive)
   * Returns an array of matching books
   */
  searchByAuthor(author: string): Book[] {
    const results: Book[] = [];
    let current = this.head;
    const searchTerm = author.toLowerCase();

    while (current) {
      if (current.data.author.toLowerCase().includes(searchTerm)) {
        results.push(current.data);
      }
      current = current.next;
    }

    return results;
  }

  /**
   * Get all books as an array
   * This converts the linked list to an array for easier manipulation
   */
  getAllBooks(): Book[] {
    const books: Book[] = [];
    let current = this.head;

    while (current) {
      books.push(current.data);
      current = current.next;
    }

    return books;
  }

  /**
   * Get available books only
   */
  getAvailableBooks(): Book[] {
    const books: Book[] = [];
    let current = this.head;

    while (current) {
      if (current.data.isAvailable) {
        books.push(current.data);
      }
      current = current.next;
    }

    return books;
  }

  /**
   * Update a book in the linked list
   * Returns true if book was found and updated, false otherwise
   */
  updateBook(bookId: string, updates: Partial<Book>): boolean {
    let current = this.head;

    while (current) {
      if (current.data.id === bookId) {
        current.data = { ...current.data, ...updates, updatedAt: new Date() };
        return true;
      }
      current = current.next;
    }

    return false;
  }

  /**
   * Get the size of the linked list
   */
  getSize(): number {
    return this.size;
  }

  /**
   * Check if the linked list is empty
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Clear all books from the linked list
   */
  clear(): void {
    this.head = null;
    this.size = 0;
  }

  /**
   * Get books by category
   */
  getBooksByCategory(category: string): Book[] {
    const results: Book[] = [];
    let current = this.head;
    const searchCategory = category.toLowerCase();

    while (current) {
      if (current.data.category.toLowerCase() === searchCategory) {
        results.push(current.data);
      }
      current = current.next;
    }

    return results;
  }

  /**
   * Get books borrowed by a specific user
   */
  getBooksByUser(userId: string): Book[] {
    const results: Book[] = [];
    let current = this.head;

    while (current) {
      if (current.data.borrowedBy === userId) {
        results.push(current.data);
      }
      current = current.next;
    }

    return results;
  }
} 