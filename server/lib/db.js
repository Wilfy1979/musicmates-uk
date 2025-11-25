const Database = require('better-sqlite3');
const path = require('path');

const DB_FILE = process.env.DB_FILE || 'data/musicmates.db';
const dbPath = path.resolve(process.cwd(), DB_FILE);

let db = null;

/**
 * Get the database instance
 * @returns {Database.Database} The database instance
 */
function getDb() {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

/**
 * Close the database connection
 */
function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = {
  getDb,
  closeDb,
};
