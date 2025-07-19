import React, { useState } from 'react';
import { Book } from '../types';
import { useBooks } from '../contexts/BookContext';
import { useAuth } from '../contexts/AuthContext';
import {
  TrashIcon,
  EyeIcon,
  BookmarkIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface BookListProps {
  books: Book[];
  showActions?: boolean;
  isAdmin?: boolean;
  viewMode?: 'grid' | 'table';
}

const BookList: React.FC<BookListProps> = ({ 
  books, 
  showActions = false, 
  isAdmin = false,
  viewMode = 'grid' 
}) => {
  const { deleteBook, borrowBook, returnBook, isLoading } = useBooks();
  const { user } = useAuth();
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null);
  const [borrowingBookId, setBorrowingBookId] = useState<string | null>(null);

  const handleDelete = async (bookId: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setDeletingBookId(bookId);
      await deleteBook(bookId);
      setDeletingBookId(null);
    }
  };

  const handleBorrow = async (bookId: string) => {
    if (!user) return;
    setBorrowingBookId(bookId);
    await borrowBook(bookId, user.id);
    setBorrowingBookId(null);
  };

  const handleReturn = async (bookId: string) => {
    if (!user) return;
    setBorrowingBookId(bookId);
    await returnBook(bookId, user.id);
    setBorrowingBookId(null);
  };

  const isBookBorrowedByCurrentUser = (book: Book) => {
    return book.borrowedBy === user?.id;
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <BookmarkIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No books found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {showActions && isAdmin ? 'Add some books to get started.' : 'No books match your search criteria.'}
        </p>
      </div>
    );
  }

  if (viewMode === 'table') {
    return (
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ISBN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {showActions && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{book.title}</div>
                      <div className="text-sm text-gray-500">by {book.author}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {book.isbn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {book.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      book.isAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {book.isAvailable ? 'Available' : 'Borrowed'}
                    </span>
                  </td>
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {isAdmin ? (
                          <>
                            <button
                              onClick={() => handleDelete(book.id)}
                              disabled={deletingBookId === book.id || isLoading}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              title="Delete book"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            {book.isAvailable ? (
                              <button
                                onClick={() => handleBorrow(book.id)}
                                disabled={borrowingBookId === book.id || isLoading}
                                className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                                title="Borrow book"
                              >
                                <BookmarkIcon className="h-4 w-4" />
                              </button>
                            ) : isBookBorrowedByCurrentUser(book) ? (
                              <button
                                onClick={() => handleReturn(book.id)}
                                disabled={borrowingBookId === book.id || isLoading}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                title="Return book"
                              >
                                <ArrowPathIcon className="h-4 w-4" />
                              </button>
                            ) : (
                              <span className="text-gray-400" title="Book borrowed by another user">
                                <EyeIcon className="h-4 w-4" />
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <div key={book.id} className="card hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
              <div className="flex items-center space-x-2 mb-3">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {book.category}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  book.isAvailable
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {book.isAvailable ? 'Available' : 'Borrowed'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-xs text-gray-500">
              <span className="font-medium">ISBN:</span> {book.isbn}
            </p>
            {!book.isAvailable && book.borrowedAt && (
              <p className="text-xs text-gray-500">
                <span className="font-medium">Borrowed:</span> {new Date(book.borrowedAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {showActions && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              {isAdmin ? (
                <button
                  onClick={() => handleDelete(book.id)}
                  disabled={deletingBookId === book.id || isLoading}
                  className="btn-danger text-sm flex items-center"
                >
                  {deletingBookId === book.id ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <TrashIcon className="h-3 w-3 mr-1" />
                      Delete
                    </>
                  )}
                </button>
              ) : (
                <>
                  {book.isAvailable ? (
                    <button
                      onClick={() => handleBorrow(book.id)}
                      disabled={borrowingBookId === book.id || isLoading}
                      className="btn-primary text-sm flex items-center"
                    >
                      {borrowingBookId === book.id ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                          Borrowing...
                        </>
                      ) : (
                        <>
                          <BookmarkIcon className="h-3 w-3 mr-1" />
                          Borrow
                        </>
                      )}
                    </button>
                  ) : isBookBorrowedByCurrentUser(book) ? (
                    <button
                      onClick={() => handleReturn(book.id)}
                      disabled={borrowingBookId === book.id || isLoading}
                      className="btn-secondary text-sm flex items-center"
                    >
                      {borrowingBookId === book.id ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-1"></div>
                          Returning...
                        </>
                      ) : (
                        <>
                          <ArrowPathIcon className="h-3 w-3 mr-1" />
                          Return
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-sm text-gray-500">Borrowed by another user</span>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BookList; 