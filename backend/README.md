# BhashaConnect Backend

RESTful API backend for the BhashaConnect multilingual job & entrepreneurship platform.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

3. **Database Setup**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE bhashaconnect;
   
   # Run migrations
   npm run migrate
   
   # Seed sample data
   npm run seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   └── auth.js              # Authentication middleware
├── migrations/
│   ├── 001_create_users_table.js
│   ├── 002_create_jobs_table.js
│   ├── 003_create_training_content_table.js
│   ├── 004_create_marketplace_table.js
│   └── 005_create_schemes_table.js
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── jobs.js              # Jobs CRUD routes
│   ├── training.js          # Training content routes
│   ├── marketplace.js       # Marketplace routes
│   └── schemes.js           # Government schemes routes
├── seeds/
│   ├── 01_users.js          # User seed data
│   ├── 02_jobs.js           # Jobs seed data
│   ├── 03_training_content.js
│   ├── 04_marketplace.js
│   └── 05_schemes.js
├── server.js                # Main server file
├── knexfile.js              # Knex configuration
└── package.json
```

## 🔧 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "jobseeker"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

### Jobs Endpoints

#### Get All Jobs
```http
GET /jobs?page=1&limit=10&category=Technology&location=Mumbai&language=English
```

#### Get Job by ID
```http
GET /jobs/1
```

#### Create Job
```http
POST /jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Software Developer",
  "description": "Full-stack developer position",
  "category": "Technology",
  "location": "Mumbai, Maharashtra",
  "language": "English"
}
```

#### Update Job
```http
PUT /jobs/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Senior Software Developer",
  "description": "Updated description"
}
```

#### Delete Job
```http
DELETE /jobs/1
Authorization: Bearer <token>
```

### Training Content Endpoints

#### Get All Training Content
```http
GET /training?page=1&limit=10&type=video&language=English
```

#### Create Training Content
```http
POST /training
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Digital Marketing Basics",
  "type": "video",
  "url": "https://youtube.com/watch?v=example",
  "language": "English",
  "description": "Learn digital marketing fundamentals"
}
```

### Marketplace Endpoints

#### Get All Businesses
```http
GET /marketplace?page=1&limit=10&location=Mumbai&language=English
```

#### Create Business
```http
POST /marketplace
Authorization: Bearer <token>
Content-Type: application/json

{
  "business_name": "Tech Solutions",
  "owner_name": "John Doe",
  "product_service": "Web Development Services",
  "contact": "+91-9876543210",
  "language": "English",
  "location": "Mumbai, Maharashtra"
}
```

### Schemes Endpoints

#### Get All Schemes
```http
GET /schemes?page=1&limit=10&category=Finance&language=English
```

#### Create Scheme (Admin Only)
```http
POST /schemes
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Startup India Scheme",
  "description": "Government scheme for startups",
  "eligibility": "Registered startup companies",
  "link": "https://startupindia.gov.in",
  "language": "English",
  "category": "Startup"
}
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('jobseeker', 'entrepreneur', 'admin') DEFAULT 'jobseeker',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Jobs Table
```sql
CREATE TABLE jobs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  language VARCHAR(50) NOT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);
```

### Training Content Table
```sql
CREATE TABLE training_content (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  type ENUM('video', 'pdf', 'text', 'infographic') NOT NULL,
  url TEXT NOT NULL,
  language VARCHAR(50) NOT NULL,
  description TEXT,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);
```

### Marketplace Table
```sql
CREATE TABLE marketplace (
  id INT PRIMARY KEY AUTO_INCREMENT,
  business_name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  product_service TEXT NOT NULL,
  contact VARCHAR(255) NOT NULL,
  language VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  description TEXT,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);
```

### Schemes Table
```sql
CREATE TABLE schemes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  link TEXT,
  language VARCHAR(50) NOT NULL,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## 📝 Error Handling

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": {
    // response data
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    "Detailed error messages"
  ]
}
```

## 🧪 Testing

### Health Check
```http
GET /api/health
```

### Sample Data
The seeded data includes:
- 5 users (1 admin, 2 job seekers, 2 entrepreneurs)
- 5 job listings in different languages
- 5 training content items
- 5 marketplace businesses
- 6 government schemes

## 🚀 Deployment

### Environment Variables
```env
DB_HOST=your-db-host
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=bhashaconnect
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

### Production Commands
```bash
npm run migrate
npm run seed
npm start
```

## 🔧 Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data

### Code Style
- Use ESLint for code linting
- Follow RESTful API conventions
- Use meaningful variable and function names
- Add comments for complex logic

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MySQL service is running
   - Verify database credentials in .env
   - Ensure database exists

2. **Migration Errors**
   - Check if database is empty
   - Verify migration files are correct
   - Check MySQL user permissions

3. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper Authorization header format

## 📞 Support

For issues and questions:
- Check the logs for error details
- Verify environment variables
- Check database connectivity
- Review API documentation

---

**BhashaConnect Backend** - Powering multilingual job & entrepreneurship platform 🚀
