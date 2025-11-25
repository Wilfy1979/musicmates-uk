# 🎵 Music Mates UK 🎵

Welcome to Music Mates UK - A music-themed dating and social platform connecting people through their shared love of music!

## 🎸 About

Music Mates UK is a web-based platform designed to bring music lovers together. Whether you're looking for concert buddies, romantic connections, or just friends who share your musical taste, Music Mates UK helps you connect with like-minded people in your area.

## ✨ Features

- **User Profiles**: Create detailed profiles with your favorite bands, genres, and recent gig experiences
- **Dating App Interface**: Swipe-style matching system to connect with other music lovers
- **Gig Discovery**: Browse and express interest in upcoming concerts and live music events
- **Location-Based**: Find matches in major UK cities including London, Manchester, Birmingham, Glasgow, and more
- **Music Preferences**: Connect based on shared favorite bands and music genres
- **Admin Tools**: Special creator/admin profile management

## 📁 Project Structure

```
musicmates-uk/
├── server/                 # Backend Express application
│   ├── index.js           # Main server entry point
│   ├── migrate.js         # Database migration script
│   ├── lib/
│   │   └── db.js          # Database helper (better-sqlite3)
│   └── routes/
│       ├── auth.js        # Authentication routes
│       ├── profiles.js    # Profile management routes
│       └── browse.js      # Browse/search profiles routes
├── public/                # Static files served by Express
│   ├── index.html         # Main landing page
│   ├── signup.html        # User registration form
│   ├── app.html           # Dating app with profile browsing
│   ├── gigs.html          # Upcoming gigs listing
│   ├── profile.html       # User profile page
│   ├── upload.html        # Content upload page
│   ├── where.html         # Venue discovery page
│   ├── styles.css         # Main stylesheet
│   ├── script.js          # Dating app JavaScript
│   ├── js/
│   │   └── app.js         # Progressive enhancement script
│   └── admin/
│       └── profile-creator.html
├── data/                  # Database directory (auto-created)
├── package.json           # Node.js dependencies and scripts
├── .env.example           # Environment variables template
├── .eslintrc.json         # ESLint configuration
├── .prettierrc            # Prettier configuration
└── .editorconfig          # Editor configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone this repository
   ```bash
   git clone https://github.com/Wilfy1979/musicmates-uk.git
   cd musicmates-uk
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create environment file
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and set a secure `SESSION_SECRET`:
   ```
   SESSION_SECRET=your-secure-random-string-here
   PORT=3000
   DB_FILE=data/musicmates.db
   ```

5. Run database migrations
   ```bash
   npm run migrate
   ```

6. Start the server
   ```bash
   npm run dev
   ```

7. Open http://localhost:3000 in your browser

### Available Scripts

- `npm run dev` - Start the development server
- `npm start` - Start the production server
- `npm run migrate` - Run database migrations
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

## 🔌 API Endpoints

### Health Check
- `GET /health` - Returns `{ ok: true }`

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login an existing user
- `POST /api/auth/logout` - Logout current user
- `GET /api/auth/me` - Get current user info

### Profiles
- `POST /api/profiles/upsert` - Create or update profile (requires auth)
- `GET /api/profiles/mine` - Get current user's profile (requires auth)

### Browse
- `GET /api/browse` - List profiles with optional filters
  - Query params: `instrument`, `genre`, `location`, `limit`, `offset`

## 🎯 Using the App

1. Navigate to the Sign Up page to create your profile
2. Fill in your details including:
   - Name, age, and location
   - Favorite bands (top 5)
   - Preferred music genres
   - Recent gig experiences
   - What you're looking for (friends, dating, concert buddies, etc.)
3. Browse profiles in the App section
4. Check out upcoming gigs in your area

## 🎨 Design

Music Mates UK features a distinctive black and yellow color scheme that represents the energy and vibrancy of the music scene. The interface is designed to be:
- Clean and modern
- Easy to navigate
- Mobile-responsive
- Focused on the music experience

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)
- LocalStorage API for data persistence
- Responsive design principles

### Backend
- Node.js with Express
- better-sqlite3 for database
- express-session for authentication
- express-rate-limit for API rate limiting
- helmet for security headers

## 🔒 Security Notes

This is a development scaffold. For production deployment, consider:

- **CSRF Protection**: Add CSRF token validation for state-changing requests
- **Content Security Policy**: Enable CSP in helmet configuration after refactoring inline scripts/styles
- **HTTPS**: Enable secure cookies and use HTTPS in production
- **Database**: Consider migrating to PostgreSQL for production scale
- **Password Requirements**: Implement stronger password policies

## 🌍 Supported Cities

- London
- Manchester
- Birmingham
- Glasgow
- Liverpool
- Edinburgh
- Cardiff
- Belfast
- Bristol
- Leeds
- Sheffield
- Newcastle

## 🎵 Music Genres Supported

Rock, Pop, Indie, Metal, Jazz, Classical, Electronic, Hip Hop, Country, Punk, Alternative, Blues, Reggae, Soul, Folk

## 📱 Browser Compatibility

Works on all modern browsers:
- Google Chrome
- Mozilla Firefox
- Safari
- Microsoft Edge

## 🔮 Future Enhancements

- Real-time messaging
- Spotify/Apple Music integration
- Advanced matching algorithms
- Event ticketing integration
- Mobile app versions
- User photo uploads
- Video chat for virtual concerts
- Migration to PostgreSQL for production

## 📄 License

Copyright © 2025 Music Mates UK. All rights reserved.

## 👥 Contributing

This is a template repository. Feel free to fork and customize for your own music-themed social platform!

---

**Find your perfect music match today! 🎸💕**
