/**
 * Authentication middleware
 * Protects endpoints by requiring user authentication
 * 
 * NOTE: This is a simplified placeholder for development/testing.
 * In production, implement proper JWT token validation or session-based auth.
 * The X-User-Id header approach is not secure for production use.
 */
function authMiddleware(req, res, next) {
  // Get user ID from header
  // TODO: Replace with JWT/session-based authentication for production
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
