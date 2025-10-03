@echo off
echo 🚀 Setting up BhashaConnect - Multilingual Job & Entrepreneurship Platform
echo ==================================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js (v14 or higher) first.
    pause
    exit /b 1
)

REM Check if MySQL is installed
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MySQL is not installed. Please install MySQL (v8.0 or higher) first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Backend Setup
echo 📦 Setting up backend...
cd backend

REM Install dependencies
echo Installing backend dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy env.example .env
    echo ⚠️  Please edit backend\.env with your database credentials
)

cd ..

REM Frontend Setup
echo 📦 Setting up frontend...
cd frontend

REM Install dependencies
echo Installing frontend dependencies...
call npm install

cd ..

echo ✅ Dependencies installed successfully

REM Database Setup Instructions
echo.
echo 🗄️  Database Setup Instructions:
echo ================================
echo 1. Create a MySQL database named 'bhashaconnect':
echo    mysql -u root -p
echo    CREATE DATABASE bhashaconnect;
echo.
echo 2. Update backend\.env with your database credentials:
echo    DB_HOST=localhost
echo    DB_PORT=3306
echo    DB_USER=your_username
echo    DB_PASSWORD=your_password
echo    DB_NAME=bhashaconnect
echo    JWT_SECRET=your_super_secret_jwt_key_here
echo.
echo 3. Run database migrations and seed data:
echo    cd backend
echo    npm run migrate
echo    npm run seed
echo.

REM Start Instructions
echo 🚀 Starting the Application:
echo =============================
echo 1. Start the backend server:
echo    cd backend && npm run dev
echo.
echo 2. In a new terminal, start the frontend:
echo    cd frontend && npm start
echo.
echo 3. Open your browser and go to: http://localhost:3000
echo.

REM Demo Credentials
echo 🔑 Demo Credentials:
echo ===================
echo Admin: admin@bhashaconnect.com / password123
echo Job Seeker: rajesh@example.com / password123
echo Entrepreneur: priya@example.com / password123
echo.

echo 🎉 Setup complete! Follow the instructions above to start the application.
echo 📚 For more information, check the README.md files in backend\ and frontend\ directories.
pause
