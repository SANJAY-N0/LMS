#!/bin/bash

# Library Management System - GitHub Setup Script
echo "🚀 Setting up GitHub repository for Library Management System..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Initialize git repository
echo "📁 Initializing git repository..."
git init

# Add all files
echo "📝 Adding files to git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Library Management System with React, TypeScript, and DSA"

echo ""
echo "✅ Local git repository created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Create a new repository on GitHub.com"
echo "2. Name it: library-management-system"
echo "3. Make it PUBLIC (required for free Vercel deployment)"
echo "4. Don't initialize with README"
echo "5. Copy the repository URL"
echo ""
echo "🔗 Then run these commands (replace YOUR_USERNAME and REPO_URL):"
echo "git remote add origin https://github.com/YOUR_USERNAME/library-management-system.git"
echo "git branch -M main"
echo "git push -u origin main"
echo ""
echo "🌐 After pushing to GitHub, deploy to Vercel:"
echo "1. Go to vercel.com"
echo "2. Sign up with GitHub"
echo "3. Import your repository"
echo "4. Deploy!"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions." 