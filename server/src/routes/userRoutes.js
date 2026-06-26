import { Router } from 'express';
import { listUsers, setUserRole } from '../controllers/userController.js';
import { authRequired } from '../middleware/auth.js';
import { adminRequired } from '../middleware/admin.js';

const router = Router();

// All user-management routes are admin-only.
router.use(authRequired, adminRequired);
router.get('/', listUsers);
router.put('/:id/role', setUserRole);

export default router;
