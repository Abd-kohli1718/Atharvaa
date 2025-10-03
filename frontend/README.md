# BhashaConnect Frontend

React-based frontend for the BhashaConnect multilingual job & entrepreneurship platform.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend API running on port 5000

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js              # Navigation component
│   │   ├── Footer.js              # Footer component
│   │   ├── OfflineIndicator.js    # Offline status indicator
│   │   └── ProtectedRoute.js      # Route protection wrapper
│   ├── context/
│   │   ├── AuthContext.js         # Authentication context
│   │   ├── LanguageContext.js     # Language switching context
│   │   └── OfflineContext.js      # Offline functionality context
│   ├── i18n/
│   │   ├── index.js               # i18n configuration
│   │   └── locales/
│   │       ├── en.json            # English translations
│   │       ├── hi.json            # Hindi translations
│   │       ├── mr.json            # Marathi translations
│   │       └── vah.json           # Varhadi translations
│   ├── pages/
│   │   ├── Home.js                # Landing page
│   │   ├── Login.js               # Login page
│   │   ├── Register.js            # Registration page
│   │   ├── Jobs.js                # Jobs listing page
│   │   ├── Training.js            # Training content page
│   │   ├── Marketplace.js         # Marketplace page
│   │   ├── Schemes.js             # Government schemes page
│   │   └── Profile.js             # User profile page
│   ├── App.js                     # Main app component
│   ├── index.js                   # App entry point
│   └── index.css                  # Global styles
├── tailwind.config.js             # Tailwind CSS configuration
└── package.json
```

## 🌐 Features

### Multilingual Support
- **Supported Languages**: English, Hindi, Marathi, Varhadi
- **Language Detection**: Automatic detection based on browser settings
- **Language Persistence**: Selected language saved in localStorage
- **RTL Support**: Right-to-left text support for appropriate languages

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tailwind CSS**: Utility-first CSS framework
- **Modern UI**: Clean and intuitive interface
- **Accessibility**: WCAG compliant design patterns

### Offline Support
- **Local Storage**: Cached content for offline access
- **Offline Indicator**: Visual feedback when offline
- **Graceful Degradation**: Limited functionality when offline
- **Data Sync**: Automatic sync when back online

### Authentication
- **JWT Tokens**: Secure authentication
- **Role-Based Access**: Different permissions for different user types
- **Protected Routes**: Secure page access
- **Auto-Logout**: Token expiration handling

## 🎨 UI Components

### Navigation
- **Responsive Navbar**: Collapsible mobile menu
- **Language Selector**: Easy language switching
- **User Menu**: Profile and logout options
- **Breadcrumbs**: Navigation context

### Pages
- **Home**: Landing page with features overview
- **Jobs**: Job listings with search and filters
- **Training**: Training content with type filtering
- **Marketplace**: Business listings and profiles
- **Schemes**: Government schemes information
- **Profile**: User profile and activity stats

### Forms
- **Login/Register**: Authentication forms
- **Search/Filter**: Advanced filtering options
- **CRUD Operations**: Create, read, update, delete forms
- **Validation**: Client-side form validation

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=BhashaConnect
```

### API Configuration
The frontend is configured to proxy API requests to the backend:

```json
{
  "proxy": "http://localhost:5000"
}
```

### i18n Configuration
Language files are located in `src/i18n/locales/`:
- `en.json` - English translations
- `hi.json` - Hindi translations
- `mr.json` - Marathi translations
- `vah.json` - Varhadi translations

## 🎯 Usage

### Language Switching
```jsx
import { useLanguage } from './context/LanguageContext';

const { currentLanguage, changeLanguage, languages } = useLanguage();

// Change language
changeLanguage('hi'); // Switch to Hindi

// Get current language
console.log(currentLanguage); // 'hi'

// Get available languages
console.log(languages); // Array of language objects
```

### Authentication
```jsx
import { useAuth } from './context/AuthContext';

const { user, isAuthenticated, login, logout } = useAuth();

// Check if user is logged in
if (isAuthenticated) {
  console.log('User:', user);
}

// Login user
const result = await login(email, password);

// Logout user
logout();
```

### Offline Support
```jsx
import { useOffline } from './context/OfflineContext';

const { isOnline, saveOfflineData, getOfflineData } = useOffline();

// Check online status
if (!isOnline) {
  console.log('User is offline');
}

// Save data for offline access
saveOfflineData('jobs', jobsData);

// Retrieve offline data
const offlineJobs = getOfflineData('jobs');
```

## 🎨 Styling

### Tailwind CSS
The project uses Tailwind CSS for styling:

```jsx
// Utility classes
<div className="bg-white rounded-lg shadow-sm p-6">
  <h1 className="text-2xl font-bold text-gray-900">
    Title
  </h1>
</div>

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Content */}
</div>

// Language-specific styling
<p className="hindi-text">
  हिंदी टेक्स्ट
</p>
```

### Custom CSS
Global styles are defined in `src/index.css`:

```css
/* Language-specific fonts */
.hindi-text {
  font-family: 'Noto Sans Devanagari', sans-serif;
}

.marathi-text {
  font-family: 'Noto Sans Devanagari', sans-serif;
}

/* Custom animations */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_APP_NAME=BhashaConnect
```

### Static File Serving
The build folder can be served by any static file server:
- Nginx
- Apache
- AWS S3
- Netlify
- Vercel

## 🧪 Testing

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Testing Components
```jsx
import { render, screen } from '@testing-library/react';
import { AuthProvider } from './context/AuthContext';
import App from './App';

test('renders app', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  
  expect(screen.getByText('BhashaConnect')).toBeInTheDocument();
});
```

## 🔧 Development

### Code Structure
- **Components**: Reusable UI components
- **Pages**: Route-specific page components
- **Context**: Global state management
- **Hooks**: Custom React hooks
- **Utils**: Utility functions

### Best Practices
- Use functional components with hooks
- Implement proper error boundaries
- Use TypeScript for type safety (optional)
- Follow React best practices
- Write meaningful component names
- Add proper prop validation

### Performance Optimization
- Lazy loading for routes
- Memoization for expensive calculations
- Image optimization
- Bundle size optimization
- Code splitting

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Check if backend is running
   - Verify API URL in configuration
   - Check CORS settings

2. **Language Not Switching**
   - Check language files exist
   - Verify i18n configuration
   - Clear localStorage

3. **Authentication Issues**
   - Check JWT token validity
   - Verify token storage
   - Check API authentication

4. **Offline Mode Not Working**
   - Check browser support
   - Verify service worker
   - Check localStorage permissions

### Debug Mode
Enable debug mode for i18n:

```javascript
// In src/i18n/index.js
i18n.init({
  debug: process.env.NODE_ENV === 'development'
});
```

## 📱 Mobile Support

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Touch-friendly interface
- Swipe gestures
- Mobile-optimized forms
- Offline support
- Push notifications (future)

## 🔮 Future Enhancements

- Progressive Web App (PWA)
- Push notifications
- Advanced search
- Real-time updates
- Video conferencing
- File upload
- Analytics dashboard
- Dark mode
- Advanced filtering
- Social features

## 📞 Support

For issues and questions:
- Check browser console for errors
- Verify network connectivity
- Check API endpoints
- Review component props
- Check context providers

---

**BhashaConnect Frontend** - Multilingual job & entrepreneurship platform 🌐
