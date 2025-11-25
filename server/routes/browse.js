const express = require('express');
const { getDb } = require('../lib/db');

const router = express.Router();

// Interest type constant
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
      conditions.push(`i.type = '${INTEREST_TYPE_GENRE}' AND i.value = ?`);
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

    // Bulk fetch all genres for all profiles to avoid N+1 queries
    const profileIds = profiles.map((p) => p.id);
    const genresMap = {};

    if (profileIds.length > 0) {
      const placeholders = profileIds.map(() => '?').join(',');
      const allGenres = db
        .prepare(
          `SELECT profile_id, value FROM interests WHERE profile_id IN (${placeholders}) AND type = '${INTEREST_TYPE_GENRE}'`
        )
        .all(...profileIds);

      for (const genre of allGenres) {
        if (!genresMap[genre.profile_id]) {
          genresMap[genre.profile_id] = [];
        }
        genresMap[genre.profile_id].push(genre.value);
      }
    }

    // Format profiles for response
    const formattedProfiles = profiles.map((profile) => {
      return {
        id: profile.id,
        name: profile.name,
        age: profile.age,
        gender: profile.gender,
        city: profile.city,
        bio: profile.bio,
        instruments: profile.instruments,
        favoriteBands: safeJsonParse(profile.favorite_bands, []),
        lookingFor: safeJsonParse(profile.looking_for, []),
        lastGig: {
          band: profile.last_gig_band,
          venue: profile.last_gig_venue,
        },
        photoUrl: profile.photo_url,
        genres: genresMap[profile.id] || [],
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
