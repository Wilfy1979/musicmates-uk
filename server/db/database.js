const Database = require('better-sqlite3');
const path = require('path');

let db;

/**
 * Initialize the database connection and run migrations
 */
function init() {
  const dbPath = process.env.NODE_ENV === 'test' 
    ? ':memory:' 
    : path.join(__dirname, 'musicmates.db');
  
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  
  runMigrations();
  
  return db;
}

/**
 * Run database migrations
 */
function runMigrations() {
  // Create users table (for interest validation)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create interests table with moderation-friendly fields
  db.exec(`
    CREATE TABLE IF NOT EXISTS interests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      target_id INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'declined')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (target_id) REFERENCES users(id),
      UNIQUE(sender_id, target_id)
    )
  `);

  // Create index for efficient queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_interests_sender ON interests(sender_id);
    CREATE INDEX IF NOT EXISTS idx_interests_target ON interests(target_id);
    CREATE INDEX IF NOT EXISTS idx_interests_status ON interests(status);
  `);
}

/**
 * Get the database instance
 */
function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call init() first.');
  }
  return db;
}

/**
 * Close the database connection
 */
function close() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = {
  init,
  getDb,
  close
};
