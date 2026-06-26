// Admin access configuration.
//
// A user is treated as an admin if EITHER:
//   1. Their backend user record has `role: 'admin'` (or `isAdmin: true`), or
//   2. Their email is listed in ADMIN_EMAILS below (used to bootstrap the very
//      first admin, since no admin exists yet to promote others).
//
// To promote a user from inside the app, an existing admin can use the Users tab
// of the Admin dashboard, which sets the `role` field through the Express API.
//
// NOTE: This is client-side gating for the UI. Real authorization is enforced
// by the Express backend middleware.
export const ADMIN_EMAILS = [
  'femohammed@st.ug.edu.gh',
];

export function isAdminUser(user) {
  if (!user) return false;
  if (user.role === 'admin' || user.isAdmin === true) return true;
  const email = user.email?.toLowerCase();
  return !!email && ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email);
}
