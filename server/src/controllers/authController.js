import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken } from '../utils/token.js';

// Shared register handler for both /signup and /register. MongoDB stores only
// passwordHash, never the raw password.
export async function register(req, res, next) {
  try {
    const { email, password, name = '', phone = '' } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password should be at least 6 characters.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'This email is already registered.' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email: email.toLowerCase(), passwordHash, name, phone });

    const token = signToken(user);
    res.status(201).json({ token, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/signup
export const signup = register;

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) return res.status(401).json({ message: 'No account found with this email.' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Incorrect password. Please try again.' });

    const token = signToken(user);
    res.json({ token, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
export async function me(req, res) {
  res.json({ user: req.user.toSafeJSON() });
}

// POST /api/auth/logout
export async function logout(req, res) {
  // JWT logout is client-side: the frontend deletes its token. This endpoint
  // gives the REST API an explicit logout route for apps that expect one.
  res.json({ success: true, message: 'Logged out successfully.' });
}

// PUT /api/auth/profile
export async function updateProfile(req, res, next) {
  try {
    const allowed = ['name', 'phone', 'location', 'profilePictureUrl'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) req.user[key] = req.body[key];
    }
    await req.user.save();
    res.json({ user: req.user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}
