import { Router } from 'express';
import { register, signup, login, logout, me, updateProfile } from '../controllers/authController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authRequired, logout);
router.get('/me', authRequired, me);
router.put('/profile', authRequired, updateProfile);

export default router;
