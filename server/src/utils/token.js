import jwt from 'jsonwebtoken';

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }
  return process.env.JWT_SECRET;
}

export function signToken(user) {
  // The token stores a small public identity payload. Sensitive user data stays
  // in MongoDB and is looked up again by auth middleware on protected routes.
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}
