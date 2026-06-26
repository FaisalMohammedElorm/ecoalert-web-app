const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// A user is an admin if their role is 'admin' OR their email is in ADMIN_EMAILS
// (the bootstrap allowlist). Mirrors src/config/admin.js on the frontend.
export function isAdmin(user) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return !!user.email && ADMIN_EMAILS.includes(user.email.toLowerCase());
}

export function adminRequired(req, res, next) {
  if (!isAdmin(req.user)) {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
}
