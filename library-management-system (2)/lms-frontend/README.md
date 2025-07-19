# Library Management System (LMS)

A modern, full-stack Library Management System built with React, TypeScript, Tailwind CSS, and MongoDB Atlas. This application demonstrates the use of Data Structures and Algorithms (DSA) in a real-world scenario with a custom Linked List implementation for efficient book management.

## 🚀 Features

### 🔐 Authentication System
- **Separate User & Admin Login**: Clear role-based access control
- **Demo Accounts**: Quick access with pre-configured demo credentials
- **Session Persistence**: Automatic login state management
- **Modern UI**: Clean, responsive login interface

### 📚 Book Management (Admin Only)
- **Add Books**: Complete book information with validation
- **Delete Books**: Remove books from the system
- **View All Books**: Comprehensive book listing with search
- **Real-time Updates**: Instant UI updates with MongoDB sync

### 👤 User Features
- **Browse Books**: View all available books in grid/table format
- **Search Books**: Advanced search by title, author, or ISBN
- **Borrow Books**: Mark books as borrowed by current user
- **Return Books**: Return borrowed books
- **Borrowing History**: Track all borrowed books

### 🧮 DSA Integration
- **Custom Linked List**: JavaScript implementation for book storage
- **O(1) Insertion**: Efficient book addition at list beginning
- **O(n) Search**: Linear search through linked list nodes
- **Real-time Operations**: UI reflects linked list changes instantly
- **MongoDB Sync**: Persistent storage with linked list operations

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-friendly interface
- **Dashboard Layout**: Professional sidebar navigation
- **Real-time Stats**: Live statistics and metrics
- **Loading States**: Smooth user experience
- **Error Handling**: Comprehensive error management

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Heroicons
- **State Management**: React Context API
- **Data Structure**: Custom JavaScript Linked List
- **Database**: MongoDB Atlas (simulated)
- **Build Tool**: Create React App

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Login.tsx       # Authentication interface
│   ├── Dashboard.tsx   # Main dashboard layout
│   ├── AdminPanel.tsx  # Admin-specific features
│   ├── UserPanel.tsx   # User-specific features
│   ├── AddBookForm.tsx # Book addition form
│   └── BookList.tsx    # Reusable book display
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state
│   └── BookContext.tsx # Book management state
├── services/           # External services
│   └── mongoService.ts # MongoDB operations
├── types/              # TypeScript definitions
│   └── index.ts        # Core type definitions
├── utils/              # Utility functions
│   └── LinkedList.ts   # Custom linked list implementation
└── App.tsx             # Main application component
```

## 🔧 Linked List Implementation

The system uses a custom Linked List data structure for efficient book management:

### Key Features:
- **O(1) Insertion**: New books added at the beginning
- **O(n) Search**: Linear search through nodes
- **Chronological Order**: Books maintained in reverse chronological order
- **Real-time Updates**: UI reflects linked list changes instantly

### Core Methods:
```typescript
class BookLinkedList {
  addBook(book: Book): void           // O(1) insertion
  removeBook(bookId: string): boolean // O(n) removal
  searchByTitle(title: string): Book[] // O(n) search
  getAllBooks(): Book[]               // O(n) traversal
  updateBook(bookId: string, updates): boolean // O(n) update
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lms-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Demo Accounts

#### Admin Access:
- **Email**: `admin@library.com`
- **Password**: `password`
- **Features**: Full system access, book management, user overview

#### User Access:
- **Email**: `john@example.com`
- **Password**: `password`
- **Features**: Browse, search, borrow, and return books

## 📖 Usage Guide

### For Admins:
1. **Login** with admin credentials
2. **Dashboard**: View system statistics and recent activity
3. **Add Book**: Use the form to add new books to the system
4. **Manage Books**: View, search, and delete books
5. **Users**: Monitor all users and their borrowing activity
6. **Borrowed Books**: Track all currently borrowed books

### For Users:
1. **Login** with user credentials
2. **Dashboard**: Overview of available books and personal stats
3. **Browse Books**: Explore the complete book collection
4. **Search Books**: Find specific books by title, author, or ISBN
5. **My Books**: View and manage borrowed books

## 🔄 Data Flow

1. **User Action** → React Component
2. **Component** → Context Hook
3. **Context** → Linked List Operation
4. **Linked List** → MongoDB Service
5. **MongoDB** → State Update
6. **State** → UI Re-render

## 🎯 Key Features Explained

### Linked List Integration
The system demonstrates real-world DSA application:
- Books are stored in a custom linked list for efficient operations
- UI updates reflect linked list changes in real-time
- All operations are logged and explained to users

### MongoDB Sync
- Simulated MongoDB operations for data persistence
- Real-time synchronization between frontend and database
- Error handling and retry mechanisms

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements

## 🧪 Testing

The application includes comprehensive error handling and validation:
- Form validation with real-time feedback
- Network error handling
- Loading states for better UX
- Confirmation dialogs for destructive actions

## 🔮 Future Enhancements

- **Real MongoDB Integration**: Connect to actual MongoDB Atlas cluster
- **Advanced Search**: Implement fuzzy search and filters
- **Book Recommendations**: AI-powered book suggestions
- **Notifications**: Email/SMS notifications for due dates
- **Reports**: Advanced analytics and reporting
- **Multi-language Support**: Internationalization
- **Dark Mode**: Theme switching capability

## 📝 License

This project is created for educational purposes to demonstrate:
- React and TypeScript best practices
- Data Structures and Algorithms in real applications
- Modern UI/UX design principles
- Full-stack development concepts

## 🤝 Contributing

This is a demonstration project showcasing modern web development techniques with DSA integration. Feel free to explore the code and learn from the implementation!

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, and custom DSA implementations**
