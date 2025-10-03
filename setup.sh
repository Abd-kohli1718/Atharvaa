#!/bin/bash

# BhashaConnect Setup Script
echo "🚀 Setting up BhashaConnect - Multilingual Job & Entrepreneurship Platform"
echo "=================================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v14 or higher) first."
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL (v8.0 or higher) first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Backend Setup
echo "📦 Setting up backend..."
cd backend

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp env.example .env
    echo "⚠️  Please edit backend/.env with your database credentials"
fi

cd ..

# Frontend Setup
echo "📦 Setting up frontend..."
cd frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

cd ..

echo "✅ Dependencies installed successfully"

# Database Setup Instructions
echo ""
echo "🗄️  Database Setup Instructions:"
echo "================================"
echo "1. Create a MySQL database named 'bhashaconnect':"
echo "   mysql -u root -p"
echo "   CREATE DATABASE bhashaconnect;"
echo ""
echo "2. Update backend/.env with your database credentials:"
echo "   DB_HOST=localhost"
echo "   DB_PORT=3306"
echo "   DB_USER=your_username"
echo "   DB_PASSWORD=your_password"
echo "   DB_NAME=bhashaconnect"
echo "   JWT_SECRET=your_super_secret_jwt_key_here"
echo ""
echo "3. Run database migrations and seed data:"
echo "   cd backend"
echo "   npm run migrate"
echo "   npm run seed"
echo ""

# Start Instructions
echo "🚀 Starting the Application:"
echo "============================"
echo "1. Start the backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd frontend && npm start"
echo ""
echo "3. Open your browser and go to: http://localhost:3000"
echo ""

# Demo Credentials
echo "🔑 Demo Credentials:"
echo "==================="
echo "Admin: admin@bhashaconnect.com / password123"
echo "Job Seeker: rajesh@example.com / password123"
echo "Entrepreneur: priya@example.com / password123"
echo ""

echo "🎉 Setup complete! Follow the instructions above to start the application."
echo "📚 For more information, check the README.md files in backend/ and frontend/ directories."
