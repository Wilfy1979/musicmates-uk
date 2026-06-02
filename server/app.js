const express = require('express');
const path = require('path');

const interestsRouter = require('./routes/interests');
const db = require('./db/database');

const app = express();

// Middleware
app.use(express.json());

// Initialize database
db.init();

// Routes
app.use('/api/interests', interestsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Music Mates UK API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    ok: false,
    error: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Music Mates UK API server running on port ${PORT}`);
  });
}

module.exports = app;
