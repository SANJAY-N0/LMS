import { Book, User } from '../types';

// For demo purposes, we'll use a mock service that simulates MongoDB operations
// In a real application, you would use the MongoDB driver or a REST API

export class MongoService {
  private static instance: MongoService;
  private books: Book[] = [];
  private users: User[] = [];

  private constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  public static getInstance(): MongoService {
    if (!MongoService.instance) {
      MongoService.instance = new MongoService();
    }
    return MongoService.instance;
  }

  private initializeSampleData() {
    // Sample books
    this.books = [
      {
        id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '978-0743273565',
        category: 'Fiction',
        isAvailable: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '978-0446310789',
        category: 'Fiction',
        isAvailable: true,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        id: '3',
        title: '1984',
        author: 'George Orwell',
        isbn: '978-0451524935',
        category: 'Science Fiction',
        isAvailable: true,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
      {
        id: '4',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        isbn: '978-0141439518',
        category: 'Romance',
        isAvailable: true,
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      },
      {
        id: '5',
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        isbn: '978-0547928241',
        category: 'Fantasy',
        isAvailable: true,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
      },
    ];

    // Sample users
    this.users = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@library.com',
        role: 'admin',
        borrowedBooks: [],
      },
      {
        id: '2',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        borrowedBooks: [],
      },
      {
        id: '3',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
        borrowedBooks: [],
      },
    ];
  }

  // Book operations
  async getAllBooks(): Promise<Book[]> {
    // Simulate network delay
    await this.delay(100);
    return [...this.books];
  }

  async addBook(book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
    await this.delay(200);
    const newBook: Book = {
      ...book,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.books.unshift(newBook); // Add to beginning to maintain order
    return newBook;
  }

  async updateBook(bookId: string, updates: Partial<Book>): Promise<Book | null> {
    await this.delay(150);
    const index = this.books.findIndex(book => book.id === bookId);
    if (index === -1) return null;

    this.books[index] = {
      ...this.books[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.books[index];
  }

  async deleteBook(bookId: string): Promise<boolean> {
    await this.delay(150);
    const index = this.books.findIndex(book => book.id === bookId);
    if (index === -1) return false;

    this.books.splice(index, 1);
    return true;
  }

  async findBook(bookId: string): Promise<Book | null> {
    await this.delay(50);
    return this.books.find(book => book.id === bookId) || null;
  }

  // User operations
  async getAllUsers(): Promise<User[]> {
    await this.delay(100);
    return [...this.users];
  }

  async findUserByEmail(email: string): Promise<User | null> {
    await this.delay(100);
    return this.users.find(user => user.email === email) || null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    await this.delay(150);
    const index = this.users.findIndex(user => user.id === userId);
    if (index === -1) return null;

    this.users[index] = {
      ...this.users[index],
      ...updates,
    };
    return this.users[index];
  }

  // Borrow/Return operations
  async borrowBook(bookId: string, userId: string): Promise<boolean> {
    await this.delay(200);
    const bookIndex = this.books.findIndex(book => book.id === bookId);
    const userIndex = this.users.findIndex(user => user.id === userId);

    if (bookIndex === -1 || userIndex === -1) return false;
    if (!this.books[bookIndex].isAvailable) return false;

    // Update book
    this.books[bookIndex] = {
      ...this.books[bookIndex],
      isAvailable: false,
      borrowedBy: userId,
      borrowedAt: new Date(),
      updatedAt: new Date(),
    };

    // Update user
    this.users[userIndex] = {
      ...this.users[userIndex],
      borrowedBooks: [...this.users[userIndex].borrowedBooks, bookId],
    };

    return true;
  }

  async returnBook(bookId: string, userId: string): Promise<boolean> {
    await this.delay(200);
    const bookIndex = this.books.findIndex(book => book.id === bookId);
    const userIndex = this.users.findIndex(user => user.id === userId);

    if (bookIndex === -1 || userIndex === -1) return false;
    if (this.books[bookIndex].borrowedBy !== userId) return false;

    // Update book
    this.books[bookIndex] = {
      ...this.books[bookIndex],
      isAvailable: true,
      borrowedBy: undefined,
      borrowedAt: undefined,
      updatedAt: new Date(),
    };

    // Update user
    this.users[userIndex] = {
      ...this.users[userIndex],
      borrowedBooks: this.users[userIndex].borrowedBooks.filter(id => id !== bookId),
    };

    return true;
  }

  // Search operations
  async searchBooks(query: string): Promise<Book[]> {
    await this.delay(100);
    const searchTerm = query.toLowerCase();
    return this.books.filter(book => 
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.isbn.toLowerCase().includes(searchTerm)
    );
  }

  async getBooksByCategory(category: string): Promise<Book[]> {
    await this.delay(100);
    return this.books.filter(book => 
      book.category.toLowerCase() === category.toLowerCase()
    );
  }

  async getBooksByUser(userId: string): Promise<Book[]> {
    await this.delay(100);
    return this.books.filter(book => book.borrowedBy === userId);
  }

  // Utility method to simulate network delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Sync operations (for real MongoDB integration)
  async syncToMongoDB(): Promise<void> {
    // In a real application, this would sync the local state to MongoDB
    console.log('Syncing to MongoDB...', this.books.length, 'books');
    await this.delay(500);
  }

  async syncFromMongoDB(): Promise<void> {
    // In a real application, this would fetch data from MongoDB
    console.log('Syncing from MongoDB...');
    await this.delay(500);
  }
} 