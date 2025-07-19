import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  BookOpenIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UserGroupIcon,
  BookmarkIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import AdminPanel from './AdminPanel';
import UserPanel from './UserPanel';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const isAdmin = user?.role === 'admin';

  const navigation = isAdmin
    ? [
        { name: 'Dashboard', href: 'dashboard', icon: HomeIcon },
        { name: 'Add Book', href: 'add-book', icon: PlusIcon },
        { name: 'Manage Books', href: 'manage-books', icon: BookOpenIcon },
        { name: 'Users', href: 'users', icon: UserGroupIcon },
        { name: 'Borrowed Books', href: 'borrowed-books', icon: BookmarkIcon },
      ]
    : [
        { name: 'Dashboard', href: 'dashboard', icon: HomeIcon },
        { name: 'Browse Books', href: 'browse-books', icon: BookOpenIcon },
        { name: 'Search Books', href: 'search-books', icon: MagnifyingGlassIcon },
        { name: 'My Books', href: 'my-books', icon: BookmarkIcon },
      ];

  const handleLogout = () => {
    logout();
  };

  const renderContent = () => {
    if (isAdmin) {
      return <AdminPanel activeTab={activeTab} />;
    } else {
      return <UserPanel activeTab={activeTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <BookOpenIcon className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">LMS</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = activeTab === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.href)}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">
                {navigation.find(item => item.href === activeTab)?.name || 'Dashboard'}
              </h1>

              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                  <span>Welcome back,</span>
                  <span className="font-medium text-gray-900">{user?.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 