import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpenIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login({ email, password });
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleDemoLogin = async (type: 'user' | 'admin') => {
    setLoginType(type);
    const demoCredentials = {
      user: { email: 'john@example.com', password: 'password' },
      admin: { email: 'admin@library.com', password: 'password' }
    };
    
    const success = await login(demoCredentials[type]);
    if (!success) {
      setError('Demo login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <BookOpenIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Library Management System
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your account
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Login Type Selector */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => setLoginType('user')}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                loginType === 'user'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserIcon className="h-4 w-4 mr-2" />
              User Login
            </button>
            <button
              type="button"
              onClick={() => setLoginType('admin')}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                loginType === 'admin'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ShieldCheckIcon className="h-4 w-4 mr-2" />
              Admin Login
            </button>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder={loginType === 'admin' ? 'admin@library.com' : 'john@example.com'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex justify-center items-center"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  `Sign in as ${loginType === 'admin' ? 'Admin' : 'User'}`
                )}
              </button>
            </div>
          </form>

          {/* Demo Login Buttons */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or try demo accounts</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDemoLogin('user')}
                disabled={isLoading}
                className="btn-secondary text-sm"
              >
                Demo User
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                disabled={isLoading}
                className="btn-secondary text-sm"
              >
                Demo Admin
              </button>
            </div>
          </div>

          {/* Registration Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => window.location.href = '/register'}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Create one here
              </button>
            </p>
          </div>

          {/* Info Section */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              {loginType === 'admin' ? 'Admin Features:' : 'User Features:'}
            </h3>
            <ul className="text-xs text-blue-700 space-y-1">
              {loginType === 'admin' ? (
                <>
                  <li>• Add, edit, and delete books</li>
                  <li>• View all users and their borrowed books</li>
                  <li>• Manage library inventory</li>
                  <li>• Access admin dashboard</li>
                </>
              ) : (
                <>
                  <li>• Browse and search books</li>
                  <li>• Borrow and return books</li>
                  <li>• View borrowing history</li>
                  <li>• Access user dashboard</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 