import React, { useState } from 'react';
import { useBooks } from '../contexts/BookContext';
import { BookFormData } from '../types';
import { PlusIcon } from '@heroicons/react/24/outline';

const AddBookForm: React.FC = () => {
  const { addBook, isLoading } = useBooks();
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    isbn: '',
    category: '',
  });
  const [errors, setErrors] = useState<Partial<BookFormData>>({});
  const [success, setSuccess] = useState(false);

  const categories = [
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Fantasy',
    'Romance',
    'Mystery',
    'Thriller',
    'Biography',
    'History',
    'Science',
    'Technology',
    'Philosophy',
    'Religion',
    'Self-Help',
    'Business',
    'Economics',
    'Politics',
    'Travel',
    'Cooking',
    'Art',
    'Music',
    'Sports',
    'Health',
    'Education',
    'Children',
    'Young Adult',
    'Poetry',
    'Drama',
    'Comics',
    'Other',
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<BookFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.isbn.trim()) {
      newErrors.isbn = 'ISBN is required';
    } else if (!/^[0-9-]{10,17}$/.test(formData.isbn.replace(/\s/g, ''))) {
      newErrors.isbn = 'Please enter a valid ISBN (10-17 digits with optional hyphens)';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    const success = await addBook(formData);
    if (success) {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        category: '',
      });
      setSuccess(true);
      setErrors({});
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleInputChange = (field: keyof BookFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="text-sm text-green-700">
              Book added successfully! The book has been added to the linked list and synced with MongoDB.
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Book Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`input-field mt-1 ${errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
            placeholder="Enter book title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">
            Author *
          </label>
          <input
            type="text"
            id="author"
            value={formData.author}
            onChange={(e) => handleInputChange('author', e.target.value)}
            className={`input-field mt-1 ${errors.author ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
            placeholder="Enter author name"
          />
          {errors.author && (
            <p className="mt-1 text-sm text-red-600">{errors.author}</p>
          )}
        </div>

        <div>
          <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
            ISBN *
          </label>
          <input
            type="text"
            id="isbn"
            value={formData.isbn}
            onChange={(e) => handleInputChange('isbn', e.target.value)}
            className={`input-field mt-1 ${errors.isbn ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
            placeholder="e.g., 978-0743273565"
          />
          {errors.isbn && (
            <p className="mt-1 text-sm text-red-600">{errors.isbn}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category *
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`input-field mt-1 ${errors.category ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Linked List Integration</h4>
        <p className="text-sm text-blue-700">
          When you add a book, it will be inserted at the beginning of the linked list (O(1) operation) 
          and automatically synced with MongoDB for persistence. The linked list maintains books in 
          chronological order with the newest books first.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary flex items-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Adding Book...
            </>
          ) : (
            <>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Book
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddBookForm; 