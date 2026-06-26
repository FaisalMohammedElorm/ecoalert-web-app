import { Router } from 'express';
import { createTracking, listTrackings } from '../controllers/trackingController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.use(authRequired);
router.get('/', listTrackings);
router.post('/', createTracking);

export default router;
