const fs = require('fs');
const path = require('path');
const { getDb, closeDb } = require('./lib/db');

const DB_FILE = process.env.DB_FILE || 'data/musicmates.db';
const dbDir = path.dirname(path.resolve(process.cwd(), DB_FILE));

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`Created database directory: ${dbDir}`);
}

console.log('Running migrations...');

const db = getDb();

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
console.log('Created users table');

// Create profiles table
db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    name TEXT,
    age INTEGER,
    gender TEXT,
    city TEXT,
    postcode TEXT,
    bio TEXT,
    instruments TEXT,
    favorite_bands TEXT,
    looking_for TEXT,
    last_gig_band TEXT,
    last_gig_venue TEXT,
    last_gig_date TEXT,
    last_gig_location TEXT,
    last_gig_rating INTEGER,
    photo_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);
console.log('Created profiles table');

// Create interests table (genres/music preferences)
db.exec(`
  CREATE TABLE IF NOT EXISTS interests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
  )
`);
console.log('Created interests table');

// Create index for faster lookups
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_interests_profile_id ON interests(profile_id);
  CREATE INDEX IF NOT EXISTS idx_interests_type ON interests(type);
  CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);
`);
console.log('Created indexes');

closeDb();

console.log('Migrations completed successfully!');
