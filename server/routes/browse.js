const express = require('express');
const { getDb } = require('../lib/db');

const router = express.Router();

/**
 * GET /api/browse
 * List profiles with optional filters
 * Query params: instrument, genre, location, limit, offset
 */
router.get('/', (req, res) => {
  try {
    const { instrument, genre, location, limit = 20, offset = 0 } = req.query;
    const db = getDb();

    let query = `
      SELECT DISTINCT p.id, p.name, p.age, p.gender, p.city, p.bio,
             p.instruments, p.favorite_bands, p.looking_for,
             p.last_gig_band, p.last_gig_venue, p.photo_url,
             p.created_at
      FROM profiles p
    `;

    const conditions = [];
    const params = [];

    // Join with interests if filtering by genre
    if (genre) {
      query += ' JOIN interests i ON i.profile_id = p.id';
      conditions.push('i.type = \'genre\' AND i.value = ?');
      params.push(genre);
    }

    // Filter by location (city)
    if (location) {
      conditions.push('LOWER(p.city) = LOWER(?)');
      params.push(location);
    }

    // Filter by instrument
    if (instrument) {
      conditions.push('LOWER(p.instruments) LIKE LOWER(?)');
      params.push(`%${instrument}%`);
    }

    // Add WHERE clause if there are conditions
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Add ordering and pagination
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const profiles = db.prepare(query).all(...params);

    // Format profiles for response
    const formattedProfiles = profiles.map((profile) => {
      // Get genres for this profile
      const genres = db
        .prepare(
          'SELECT value FROM interests WHERE profile_id = ? AND type = \'genre\''
        )
        .all(profile.id)
        .map((i) => i.value);

      return {
        id: profile.id,
        name: profile.name,
        age: profile.age,
        gender: profile.gender,
        city: profile.city,
        bio: profile.bio,
        instruments: profile.instruments,
        favoriteBands: JSON.parse(profile.favorite_bands || '[]'),
        lookingFor: JSON.parse(profile.looking_for || '[]'),
        lastGig: {
          band: profile.last_gig_band,
          venue: profile.last_gig_venue,
        },
        photoUrl: profile.photo_url,
        genres,
        createdAt: profile.created_at,
      };
    });

    res.json({ ok: true, profiles: formattedProfiles });
  } catch (error) {
    console.error('Browse profiles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
