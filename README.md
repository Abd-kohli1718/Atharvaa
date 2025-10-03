# BhashaConnect - Multilingual Job & Entrepreneurship Platform

BhashaConnect is a comprehensive multilingual platform that connects job seekers and entrepreneurs across different languages and regions. The platform supports English, Hindi, Marathi, and Varhadi languages, making it accessible to a diverse user base.

## 🌟 Features

### Core Features (MVP)
- **User Authentication**: JWT-based login/signup with role-based access
- **Jobs Module**: CRUD operations for job listings with multilingual support
- **Entrepreneurship Training**: Video, PDF, and text content for skill development
- **Local Marketplace**: Business profiles and product/service listings
- **Government Schemes**: Information about available schemes and benefits
- **Language Toggle**: Multi-language support with i18n
- **Offline Support**: Local storage for offline content access

### Tech Stack
- **Backend**: Node.js + Express + MySQL + Knex.js
- **Frontend**: React + React Router + i18next
- **Authentication**: JWT tokens
- **Styling**: Tailwind CSS
- **Database**: MySQL with migrations and seeds

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bhashaconnect
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env with your database credentials
   npm run migrate
   npm run seed
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Database Setup**
   - Create a MySQL database named `bhashaconnect`
   - Update the `.env` file with your database credentials
   - Run migrations: `npm run migrate`
   - Seed sample data: `npm run seed`

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bhashaconnect

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## 📱 Usage

### Demo Credentials
- **Admin**: admin@bhashaconnect.com / password123
- **Job Seeker**: rajesh@example.com / password123
- **Entrepreneur**: priya@example.com / password123

### User Roles
- **Job Seeker**: Can view and apply for jobs
- **Entrepreneur**: Can post jobs, add training content, and manage businesses
- **Admin**: Full access to all features and content management

### Supported Languages
- English
- Hindi (हिंदी)
- Marathi (मराठी)
- Varhadi (वरहाडी)

## 🏗️ Project Structure

```
bhashaconnect/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── migrations/
│   ├── routes/
│   ├── seeds/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── i18n/
│   │   ├── pages/
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Training
- `GET /api/training` - Get all training content
- `GET /api/training/:id` - Get content by ID
- `POST /api/training` - Create new content
- `PUT /api/training/:id` - Update content
- `DELETE /api/training/:id` - Delete content

### Marketplace
- `GET /api/marketplace` - Get all businesses
- `GET /api/marketplace/:id` - Get business by ID
- `POST /api/marketplace` - Create new business
- `PUT /api/marketplace/:id` - Update business
- `DELETE /api/marketplace/:id` - Delete business

### Schemes
- `GET /api/schemes` - Get all schemes
- `GET /api/schemes/:id` - Get scheme by ID
- `POST /api/schemes` - Create new scheme (admin only)
- `PUT /api/schemes/:id` - Update scheme (admin only)
- `DELETE /api/schemes/:id` - Delete scheme (admin only)

## 🎨 Features in Detail

### Multilingual Support
- Complete i18n implementation with React i18next
- Language detection and persistence
- Fallback to English for missing translations
- RTL support for appropriate languages

### Offline Support
- Local storage for cached content
- Offline indicator
- Graceful degradation when offline
- Data synchronization when back online

### Responsive Design
- Mobile-first approach
- Tailwind CSS for styling
- Clean and modern UI
- Accessible design patterns

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Input validation with Joi
- CORS configuration
- Helmet for security headers

## 🚀 Deployment

### Backend Deployment
1. Set up a MySQL database
2. Configure environment variables
3. Run migrations: `npm run migrate`
4. Start the server: `npm start`

### Frontend Deployment
1. Build the project: `npm run build`
2. Serve the build folder with a web server
3. Configure API endpoints for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- Real-time notifications
- Advanced search and filtering
- File upload for training content
- Mobile app development
- Analytics dashboard
- Payment integration
- Video conferencing integration

---

**BhashaConnect** - Connecting Jobs & Entrepreneurship Across Languages 🌐
