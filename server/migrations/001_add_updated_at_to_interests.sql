-- Migration: Add updated_at column to interests table
-- This migration ensures the interests table has an updated_at column for moderation

-- The interests table schema:
-- CREATE TABLE IF NOT EXISTS interests (
--   id INTEGER PRIMARY KEY AUTOINCREMENT,
--   sender_id INTEGER NOT NULL,
--   target_id INTEGER NOT NULL,
--   status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'declined')),
--   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (sender_id) REFERENCES users(id),
--   FOREIGN KEY (target_id) REFERENCES users(id),
--   UNIQUE(sender_id, target_id)
-- );

-- For existing databases, run this to add updated_at if it doesn't exist:
-- Note: SQLite doesn't support ADD COLUMN IF NOT EXISTS, so this would need to be run conditionally

-- Check if column exists before adding (application level check needed)
-- ALTER TABLE interests ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;

-- Create indexes for efficient querying
-- CREATE INDEX IF NOT EXISTS idx_interests_sender ON interests(sender_id);
-- CREATE INDEX IF NOT EXISTS idx_interests_target ON interests(target_id);
-- CREATE INDEX IF NOT EXISTS idx_interests_status ON interests(status);
