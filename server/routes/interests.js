const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const db = require('../db/database');

// Apply auth middleware to all routes
router.use(authMiddleware);

/**
 * POST /api/interests/:targetUserId
 * Create a new interest (pending) if not existing
 * Returns existing interest if duplicate pending interest exists
 */
router.post('/:targetUserId', (req, res) => {
  const senderId = req.userId;
  const targetUserId = parseInt(req.params.targetUserId, 10);

  // Validate targetUserId is a valid number
  if (isNaN(targetUserId) || targetUserId <= 0) {
    return res.status(400).json({
      ok: false,
      error: 'Invalid target user ID'
    });
  }

  // Cannot express interest in self
  if (senderId === targetUserId) {
    return res.status(400).json({
      ok: false,
      error: 'Cannot express interest in yourself'
    });
  }

  const database = db.getDb();

  // Check if target user exists
  const targetUser = database.prepare('SELECT id FROM users WHERE id = ?').get(targetUserId);
  if (!targetUser) {
    return res.status(404).json({
      ok: false,
      error: 'Target user not found'
    });
  }

  // Check for existing pending interest (prevent duplicates)
  const existingInterest = database.prepare(
    'SELECT id, status FROM interests WHERE sender_id = ? AND target_id = ? AND status = ?'
  ).get(senderId, targetUserId, 'pending');

  if (existingInterest) {
    return res.status(200).json({
      ok: true,
      interestId: existingInterest.id,
      duplicate: true
    });
  }

  // Create new interest
  try {
    const now = new Date().toISOString();
    const result = database.prepare(
      'INSERT INTO interests (sender_id, target_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
    ).run(senderId, targetUserId, 'pending', now, now);

    res.status(201).json({
      ok: true,
      interestId: result.lastInsertRowid
    });
  } catch (error) {
    // Handle unique constraint violation (race condition)
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      const interest = database.prepare(
        'SELECT id FROM interests WHERE sender_id = ? AND target_id = ?'
      ).get(senderId, targetUserId);
      return res.status(200).json({
        ok: true,
        interestId: interest.id,
        duplicate: true
      });
    }
    throw error;
  }
});

/**
 * GET /api/interests/sent
 * List interests initiated by current user
 */
router.get('/sent', (req, res) => {
  const senderId = req.userId;
  const database = db.getDb();

  const interests = database.prepare(`
    SELECT 
      i.id,
      i.target_id as targetUserId,
      u.name as targetUserName,
      i.status,
      i.created_at as createdAt,
      i.updated_at as updatedAt
    FROM interests i
    JOIN users u ON i.target_id = u.id
    WHERE i.sender_id = ?
    ORDER BY i.created_at DESC
  `).all(senderId);

  res.json({
    ok: true,
    interests
  });
});

/**
 * GET /api/interests/received
 * List interests where current user is target
 */
router.get('/received', (req, res) => {
  const targetId = req.userId;
  const database = db.getDb();

  const interests = database.prepare(`
    SELECT 
      i.id,
      i.sender_id as senderUserId,
      u.name as senderUserName,
      i.status,
      i.created_at as createdAt,
      i.updated_at as updatedAt
    FROM interests i
    JOIN users u ON i.sender_id = u.id
    WHERE i.target_id = ?
    ORDER BY i.created_at DESC
  `).all(targetId);

  res.json({
    ok: true,
    interests
  });
});

/**
 * PATCH /api/interests/:interestId
 * Update status (accepted, declined) if current user is target
 */
router.patch('/:interestId', (req, res) => {
  const userId = req.userId;
  const interestId = parseInt(req.params.interestId, 10);
  const { status } = req.body;

  // Validate interestId
  if (isNaN(interestId) || interestId <= 0) {
    return res.status(400).json({
      ok: false,
      error: 'Invalid interest ID'
    });
  }

  // Validate status
  if (!status || !['accepted', 'declined'].includes(status)) {
    return res.status(400).json({
      ok: false,
      error: 'Status must be "accepted" or "declined"'
    });
  }

  const database = db.getDb();

  // Get the interest
  const interest = database.prepare('SELECT * FROM interests WHERE id = ?').get(interestId);

  if (!interest) {
    return res.status(404).json({
      ok: false,
      error: 'Interest not found'
    });
  }

  // Only target user can update status
  if (interest.target_id !== userId) {
    return res.status(403).json({
      ok: false,
      error: 'Only the target user can update the status'
    });
  }

  // Update the status
  const now = new Date().toISOString();
  database.prepare(
    'UPDATE interests SET status = ?, updated_at = ? WHERE id = ?'
  ).run(status, now, interestId);

  res.json({
    ok: true,
    interestId,
    status
  });
});

/**
 * DELETE /api/interests/:interestId
 * Allow sender to withdraw if still pending
 */
router.delete('/:interestId', (req, res) => {
  const userId = req.userId;
  const interestId = parseInt(req.params.interestId, 10);

  // Validate interestId
  if (isNaN(interestId) || interestId <= 0) {
    return res.status(400).json({
      ok: false,
      error: 'Invalid interest ID'
    });
  }

  const database = db.getDb();

  // Get the interest
  const interest = database.prepare('SELECT * FROM interests WHERE id = ?').get(interestId);

  if (!interest) {
    return res.status(404).json({
      ok: false,
      error: 'Interest not found'
    });
  }

  // Only sender can withdraw
  if (interest.sender_id !== userId) {
    return res.status(403).json({
      ok: false,
      error: 'Only the sender can withdraw an interest'
    });
  }

  // Can only withdraw pending interests
  if (interest.status !== 'pending') {
    return res.status(400).json({
      ok: false,
      error: 'Can only withdraw pending interests'
    });
  }

  // Delete the interest
  database.prepare('DELETE FROM interests WHERE id = ?').run(interestId);

  res.json({
    ok: true,
    deleted: true
  });
});

module.exports = router;
