import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken } from '../utils/token.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/email.js';
import { passwordResetText, passwordResetHtml, emailVerificationText, emailVerificationHtml } from '../utils/emailTemplates.js';

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

// POST /api/auth/request-password-reset
export async function requestPasswordReset(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email: email.toLowerCase() });
    // Always return success to avoid leaking registered emails.
    if (!user) return res.json({ success: true });

    const token = crypto.randomBytes(24).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

    await sendEmail({
      to: user.email,
      subject: 'EcoAlert Password Reset',
      text: passwordResetText({ resetUrl }),
      html: passwordResetHtml({ resetUrl }),
    });

    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/reset-password
export async function resetPassword(req, res, next) {
  try {
    const { token, email, password } = req.body;
    if (!token || !email || !password) return res.status(400).json({ message: 'Token, email and new password are required.' });

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ email: email.toLowerCase(), resetPasswordToken: tokenHash }).select('+passwordHash +resetPasswordToken +resetPasswordExpires');
    if (!user) return res.status(400).json({ message: 'Invalid or expired token.' });
    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) return res.status(400).json({ message: 'Token expired.' });

    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const jwt = signToken(user);
    res.json({ success: true, token: jwt, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/send-verification
export async function sendVerificationEmail(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({ success: true });
    }
    if (user.emailVerified) return res.json({ success: true, message: 'Already verified.' });

    const token = crypto.randomBytes(24).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    user.emailVerificationToken = tokenHash;
    user.emailVerificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
    await user.save();

    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}&email=${encodeURIComponent(user.email)}`;

    await sendEmail({
      to: user.email,
      subject: 'EcoAlert Email Verification',
      text: emailVerificationText({ verifyUrl }),
      html: emailVerificationHtml({ verifyUrl }),
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/verify-email
export async function verifyEmail(req, res, next) {
  try {
    const { token, email } = req.query;
    if (!token || !email) return res.status(400).json({ message: 'Token and email are required.' });

    const tokenHash = crypto.createHash('sha256').update(String(token)).digest('hex');
    const user = await User.findOne({ email: email.toLowerCase(), emailVerificationToken: tokenHash }).select('+emailVerificationToken +emailVerificationExpires');
    if (!user) return res.status(400).json({ message: 'Invalid or expired token.' });
    if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) return res.status(400).json({ message: 'Token expired.' });

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
