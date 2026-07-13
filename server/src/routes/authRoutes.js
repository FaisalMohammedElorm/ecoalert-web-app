import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { body, query } from 'express-validator';
import {
	register, signup, login, logout, me, updateProfile,
	requestPasswordReset, resetPassword, sendVerificationEmail, verifyEmail,
} from '../controllers/authController.js';
import { authRequired } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';

const router = Router();

const requestPasswordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

const sendVerificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

const resetPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
	'/register',
	body('email').isEmail().withMessage('Please provide a valid email.'),
	body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
	body('name').optional().isString().isLength({ max: 80 }).withMessage('Name is too long.'),
	handleValidation,
	register
);

router.post(
	'/signup',
	body('email').isEmail().withMessage('Please provide a valid email.'),
	body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
	handleValidation,
	signup
);

router.post(
	'/login',
	body('email').isEmail().withMessage('Please provide a valid email.'),
	body('password').exists().withMessage('Password is required.'),
	handleValidation,
	login
);

router.post('/logout', authRequired, logout);
router.get('/me', authRequired, me);

router.put(
	'/profile',
	authRequired,
	body('name').optional().isString().isLength({ max: 80 }).withMessage('Name is too long.'),
	body('phone').optional().isString().isLength({ max: 30 }).withMessage('Phone is too long.'),
	body('location').optional().isString().isLength({ max: 120 }).withMessage('Location is too long.'),
	handleValidation,
	updateProfile
);

router.post(
	'/request-password-reset',
  requestPasswordResetLimiter,
  body('email').isEmail().withMessage('Please provide a valid email.'),
  handleValidation,
  requestPasswordReset
);

router.post(
  '/reset-password',
  resetPasswordLimiter,
  body('token').notEmpty().withMessage('Token is required.'),
  body('email').isEmail().withMessage('Please provide a valid email.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  handleValidation,
  resetPassword
);

router.post(
  '/send-verification',
  sendVerificationLimiter,
  body('email').isEmail().withMessage('Please provide a valid email.'),
  handleValidation,
  sendVerificationEmail
);

router.get(
  '/verify-email',
  query('token').notEmpty().withMessage('Verification token is required.'),
  query('email').isEmail().withMessage('Please provide a valid email.'),
  handleValidation,
  verifyEmail
);

export default router;
