import { verifyToken } from '../utils/token.js';
import User from '../models/User.js';

function extractToken(req) {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

// Requires a valid JWT. Attaches the full user document to req.user.
export async function authRequired(req, res, next) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ message: 'Authentication required.' });

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'User no longer exists.' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

// Attaches req.user if a valid token is present, but never blocks the request.
export async function authOptional(req, res, next) {
  const token = extractToken(req);
  if (!token) return next();
  try {
    const payload = verifyToken(token);
    req.user = await User.findById(payload.sub);
  } catch {
    /* ignore invalid token for optional auth */
  }
  next();
}
