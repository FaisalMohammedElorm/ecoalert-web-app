import { Router } from 'express';
import { body } from 'express-validator';
import { createTracking, listTrackings } from '../controllers/trackingController.js';
import { authRequired } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';

const router = Router();

router.use(authRequired);
router.get('/', listTrackings);
router.post(
	'/',
	body('category').notEmpty().withMessage('Category is required.').isString().isLength({ max: 60 }),
	body('quantity').optional().isFloat({ min: 0 }).withMessage('Quantity must be a non-negative number.'),
	body('weight').optional().isFloat({ min: 0 }).withMessage('Weight must be a non-negative number.'),
	body('unit').optional().isString().isLength({ max: 20 }),
	body('notes').optional().isString().isLength({ max: 500 }),
	handleValidation,
	createTracking
);

export default router;
