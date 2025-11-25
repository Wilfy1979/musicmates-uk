/**
 * Authentication middleware
 * Protects endpoints by requiring user authentication
 */
function authMiddleware(req, res, next) {
  // Get user ID from header (in production, this would be from JWT/session)
  const userId = req.headers['x-user-id'];
  
  if (!userId) {
    return res.status(401).json({
      ok: false,
      error: 'Authentication required'
    });
  }

  const parsedUserId = parseInt(userId, 10);
  if (isNaN(parsedUserId) || parsedUserId <= 0) {
    return res.status(401).json({
      ok: false,
      error: 'Invalid user ID'
    });
  }

  // Attach user ID to request
  req.userId = parsedUserId;
  next();
}

module.exports = authMiddleware;
