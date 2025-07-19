import React, { useState } from 'react';
import { useBooks } from '../contexts/BookContext';
import { MongoService } from '../services/mongoService';
import {
  BookOpenIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import AddBookForm from './AddBookForm';
import BookList from './BookList';

interface AdminPanelProps {
  activeTab: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ activeTab }) => {
  const { books, linkedList, isLoading } = useBooks();
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load users when needed
  React.useEffect(() => {
    if (activeTab === 'users' || activeTab === 'borrowed-books') {
      loadUsers();
    }
  }, [activeTab]);

  const loadUsers = async () => {
    const mongoService = MongoService.getInstance();
    const allUsers = await mongoService.getAllUsers();
    setUsers(allUsers);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <p className="text-2xl font-semibold text-gray-900">
                {books.filter(book => book.isAvailable).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Borrowed Books</p>
              <p className="text-2xl font-semibold text-gray-900">
                {books.filter(book => !book.isAvailable).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Books Added</h3>
        <div className="space-y-3">
          {books.slice(0, 5).map((book) => (
            <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{book.title}</p>
                <p className="text-sm text-gray-600">by {book.author}</p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(book.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Linked List Info */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Data Structure Information</h3>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Linked List Implementation:</strong> Books are stored in a custom JavaScript Linked List 
            data structure for efficient O(1) insertion and O(n) search operations. The linked list maintains 
            books in chronological order (newest first) and syncs with MongoDB for persistence.
          </p>
          <div className="mt-3 text-sm text-blue-700">
            <p>• Total nodes in linked list: <strong>{linkedList.getSize()}</strong></p>
            <p>• Is empty: <strong>{linkedList.isEmpty() ? 'Yes' : 'No'}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddBook = () => (
    <div className="max-w-2xl">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Book</h2>
        <AddBookForm />
      </div>
    </div>
  );

  const renderManageBooks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Manage Books</h2>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <BookList 
        books={searchQuery ? linkedList.searchByTitle(searchQuery) : books}
        showActions={true}
        isAdmin={true}
      />
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Books Borrowed
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.borrowedBooks.length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBorrowedBooks = () => {
    const borrowedBooks = books.filter(book => !book.isAvailable);
    
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Borrowed Books</h2>
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrowed By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrowed Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {borrowedBooks.map((book) => {
                  const borrower = users.find(user => user.id === book.borrowedBy);
                  return (
                    <tr key={book.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{book.title}</div>
                          <div className="text-sm text-gray-500">by {book.author}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {borrower?.name || 'Unknown User'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {book.borrowedAt ? new Date(book.borrowedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Borrowed
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

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
    case 'add-book':
      return renderAddBook();
    case 'manage-books':
      return renderManageBooks();
    case 'users':
      return renderUsers();
    case 'borrowed-books':
      return renderBorrowedBooks();
    default:
      return renderDashboard();
  }
};

export default AdminPanel; 