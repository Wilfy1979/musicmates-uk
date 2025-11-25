const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/auth');
const profilesRoutes = require('./routes/profiles');
const browseRoutes = require('./routes/browse');

const app = express();
const PORT = process.env.PORT || 3000;

// Validate SESSION_SECRET in production
if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable must be set in production');
}
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-me';

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/browse', browseRoutes);

// Static file serving
app.use(express.static(path.join(__dirname, '..', 'public')));

// Fallback to index.html for client-side routing
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Music Mates UK server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}`);
});

module.exports = app;
