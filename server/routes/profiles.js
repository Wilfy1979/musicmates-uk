const express = require('express');
const { getDb } = require('../lib/db');

const router = express.Router();

// Interest type constants
const INTEREST_TYPE_GENRE = 'genre';

/**
 * Safe JSON parse with fallback
 * @param {string} str - JSON string to parse
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {*} Parsed value or fallback
 */
function safeJsonParse(str, fallback = []) {
  try {
    return JSON.parse(str || JSON.stringify(fallback));
  } catch (_error) {
    return fallback;
  }
}

/**
 * Authentication middleware
 */
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}

/**
 * POST /api/profiles/upsert
 * Create or update the current user's profile
 */
router.post('/upsert', requireAuth, (req, res) => {
  try {
    const userId = req.session.userId;
    const {
      name,
      age,
      gender,
      city,
      postcode,
      bio,
      instruments,
      favoriteBands,
      lookingFor,
      genres,
      lastGig,
      photoUrl,
    } = req.body;

    const db = getDb();

    // Check if profile exists
    const existingProfile = db
      .prepare('SELECT id FROM profiles WHERE user_id = ?')
      .get(userId);

    let profileId;

    if (existingProfile) {
      // Update existing profile
      db.prepare(
        `
        UPDATE profiles SET
          name = ?,
          age = ?,
          gender = ?,
          city = ?,
          postcode = ?,
          bio = ?,
          instruments = ?,
          favorite_bands = ?,
          looking_for = ?,
          last_gig_band = ?,
          last_gig_venue = ?,
          last_gig_date = ?,
          last_gig_location = ?,
          last_gig_rating = ?,
          photo_url = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `
      ).run(
        name || null,
        age || null,
        gender || null,
        city || null,
        postcode || null,
        bio || null,
        instruments || null,
        JSON.stringify(favoriteBands || []),
        JSON.stringify(lookingFor || []),
        lastGig?.band || null,
        lastGig?.venue || null,
        lastGig?.date || null,
        lastGig?.location || null,
        lastGig?.rating || null,
        photoUrl || null,
        userId
      );
      profileId = existingProfile.id;
    } else {
      // Create new profile
      const result = db
        .prepare(
          `
        INSERT INTO profiles (
          user_id, name, age, gender, city, postcode, bio, instruments,
          favorite_bands, looking_for, last_gig_band, last_gig_venue,
          last_gig_date, last_gig_location, last_gig_rating, photo_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
        )
        .run(
          userId,
          name || null,
          age || null,
          gender || null,
          city || null,
          postcode || null,
          bio || null,
          instruments || null,
          JSON.stringify(favoriteBands || []),
          JSON.stringify(lookingFor || []),
          lastGig?.band || null,
          lastGig?.venue || null,
          lastGig?.date || null,
          lastGig?.location || null,
          lastGig?.rating || null,
          photoUrl || null
        );
      profileId = result.lastInsertRowid;
    }

    // Update interests (genres)
    if (genres && Array.isArray(genres)) {
      // Remove existing genre interests
      db.prepare(
        `DELETE FROM interests WHERE profile_id = ? AND type = '${INTEREST_TYPE_GENRE}'`
      ).run(profileId);

      // Add new genre interests
      const insertInterest = db.prepare(
        'INSERT INTO interests (profile_id, type, value) VALUES (?, ?, ?)'
      );
      for (const genre of genres) {
        insertInterest.run(profileId, INTEREST_TYPE_GENRE, genre);
      }
    }

    res.json({ ok: true, profileId });
  } catch (error) {
    console.error('Profile upsert error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/profiles/mine
 * Get the current user's profile
 */
router.get('/mine', requireAuth, (req, res) => {
  try {
    const userId = req.session.userId;
    const db = getDb();

    const profile = db
      .prepare(
        `
      SELECT p.*, u.email
      FROM profiles p
      JOIN users u ON u.id = p.user_id
      WHERE p.user_id = ?
    `
      )
      .get(userId);

    if (!profile) {
      return res.json({ ok: true, profile: null });
    }

    // Get interests
    const interests = db
      .prepare('SELECT type, value FROM interests WHERE profile_id = ?')
      .all(profile.id);

    // Parse JSON fields safely
    const formattedProfile = {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      age: profile.age,
      gender: profile.gender,
      city: profile.city,
      postcode: profile.postcode,
      bio: profile.bio,
      instruments: profile.instruments,
      favoriteBands: safeJsonParse(profile.favorite_bands, []),
      lookingFor: safeJsonParse(profile.looking_for, []),
      photoUrl: profile.photo_url,
      lastGig: {
        band: profile.last_gig_band,
        venue: profile.last_gig_venue,
        date: profile.last_gig_date,
        location: profile.last_gig_location,
        rating: profile.last_gig_rating,
      },
      genres: interests
        .filter((i) => i.type === INTEREST_TYPE_GENRE)
        .map((i) => i.value),
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };

    res.json({ ok: true, profile: formattedProfile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
