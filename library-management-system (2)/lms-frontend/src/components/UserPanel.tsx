import React, { useState } from 'react';
import { useBooks } from '../contexts/BookContext';
import { useAuth } from '../contexts/AuthContext';
import {
  BookOpenIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import BookList from './BookList';

interface UserPanelProps {
  activeTab: string;
}

const UserPanel: React.FC<UserPanelProps> = ({ activeTab }) => {
  const { books, linkedList, isLoading } = useBooks();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const categories = Array.from(new Set(books.map(book => book.category))).sort();
  const userBorrowedBooks = books.filter(book => book.borrowedBy === user?.id);
  const availableBooks = books.filter(book => book.isAvailable);

  const filteredBooks = React.useMemo(() => {
    let filtered = books;

    // Filter by search query
    if (searchQuery) {
      filtered = linkedList.searchByTitle(searchQuery);
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    return filtered;
  }, [books, searchQuery, selectedCategory, linkedList]);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-lg">
            <BookOpenIcon className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-900">Welcome back, {user?.name}!</h2>
            <p className="text-gray-600">Explore our collection of books and manage your borrowed items.</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpenIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Books</p>
              <p className="text-2xl font-semibold text-gray-900">{books.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpenIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Books</p>
              <p className="text-2xl font-semibold text-gray-900">{availableBooks.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BookmarkIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">My Borrowed Books</p>
              <p className="text-2xl font-semibold text-gray-900">{userBorrowedBooks.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Search</h3>
          <div className="space-y-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 5).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">My Recent Books</h3>
          <div className="space-y-3">
            {userBorrowedBooks.slice(0, 3).map((book) => (
              <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{book.title}</p>
                  <p className="text-sm text-gray-600">by {book.author}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {book.borrowedAt ? new Date(book.borrowedAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            ))}
            {userBorrowedBooks.length === 0 && (
              <p className="text-sm text-gray-500">No books borrowed yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Linked List Info */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Library System Information</h3>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Linked List Implementation:</strong> Our library uses a custom JavaScript Linked List 
            data structure for efficient book management. Books are stored in chronological order with 
            O(1) insertion and O(n) search capabilities, all synced with MongoDB for data persistence.
          </p>
          <div className="mt-3 text-sm text-blue-700">
            <p>• Total books in system: <strong>{linkedList.getSize()}</strong></p>
            <p>• Available for borrowing: <strong>{availableBooks.length}</strong></p>
            <p>• Your borrowed books: <strong>{userBorrowedBooks.length}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBrowseBooks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Browse All Books</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <BookList 
        books={filteredBooks}
        showActions={true}
        isAdmin={false}
        viewMode={viewMode}
      />
    </div>
  );

  const renderSearchBooks = () => (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Books</h2>
        <div className="space-y-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Quick filters:</span>
            {categories.slice(0, 8).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {searchQuery && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Search Results for "{searchQuery}"
            {selectedCategory && ` in ${selectedCategory}`}
          </h3>
          <BookList 
            books={filteredBooks}
            showActions={true}
            isAdmin={false}
            viewMode="grid"
          />
        </div>
      )}
    </div>
  );

  const renderMyBooks = () => (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">My Borrowed Books</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <BookmarkIcon className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-900">Currently Borrowed</p>
                <p className="text-2xl font-bold text-blue-600">{userBorrowedBooks.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookList 
        books={userBorrowedBooks}
        showActions={true}
        isAdmin={false}
        viewMode="grid"
      />

      {userBorrowedBooks.length === 0 && (
        <div className="card text-center py-12">
          <BookmarkIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No borrowed books</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't borrowed any books yet. Start exploring our collection!
          </p>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  switch (activeTab) {
    case 'dashboard':
      return renderDashboard();
    case 'browse-books':
      return renderBrowseBooks();
    case 'search-books':
      return renderSearchBooks();
    case 'my-books':
      return renderMyBooks();
    default:
      return renderDashboard();
  }
};

export default UserPanel; 