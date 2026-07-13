import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  listReports, getReport, createReport, updateReport, updateReportStatus,
  deleteReport, verifyReport, addComment,
} from '../controllers/reportController.js';
import { authRequired } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';

const router = Router();

// Public reads (the map/feed is public)
router.get(
  '/',
  // Optional query filters
  query('status').optional().isIn(['pending', 'verified', 'resolved']),
  query('userId').optional().isMongoId().withMessage('Invalid userId.'),
  query('category').optional().isString().isLength({ max: 60 }),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 200 }).toInt(),
  query('minLat').optional().isFloat({ min: -90, max: 90 }).toFloat(),
  query('maxLat').optional().isFloat({ min: -90, max: 90 }).toFloat(),
  query('minLng').optional().isFloat({ min: -180, max: 180 }).toFloat(),
  query('maxLng').optional().isFloat({ min: -180, max: 180 }).toFloat(),
  handleValidation,
  listReports
);

router.get('/:id', param('id').isMongoId().withMessage('Invalid report id.'), handleValidation, getReport);

// Authenticated actions
router.post(
  '/',
  authRequired,
  body('category').notEmpty().withMessage('Category is required.').isString().isLength({ max: 60 }),
  body('title').optional().isString().isLength({ max: 120 }),
  body('description').optional().isString().isLength({ max: 1200 }),
  body('imageUrl').optional().isString(),
  body('coordinates').optional().isObject(),
  body('coordinates.latitude').optional().isFloat({ min: -90, max: 90 }),
  body('coordinates.longitude').optional().isFloat({ min: -180, max: 180 }),
  body('location').optional().isString().isLength({ max: 180 }),
  handleValidation,
  createReport
);

router.put(
  '/:id',
  authRequired,
  param('id').isMongoId().withMessage('Invalid report id.'),
  body().custom((v) => {
    // Ensure at least one allowed field is present
    const allowed = ['category', 'title', 'description', 'imageUrl', 'coordinates', 'location'];
    return Object.keys(v || {}).some(k => allowed.includes(k));
  }).withMessage('No updatable fields provided.'),
  handleValidation,
  updateReport
);

router.put('/:id/status', authRequired, param('id').isMongoId().withMessage('Invalid report id.'), body('status').isIn(['pending', 'verified', 'resolved']).withMessage('Invalid status.'), handleValidation, updateReportStatus);

router.delete('/:id', authRequired, param('id').isMongoId().withMessage('Invalid report id.'), handleValidation, deleteReport);

router.post('/:id/verify', authRequired, param('id').isMongoId().withMessage('Invalid report id.'), handleValidation, verifyReport);

router.post('/:id/comments', authRequired, param('id').isMongoId().withMessage('Invalid report id.'), body('text').notEmpty().trim().isLength({ max: 500 }).withMessage('Comment text is required and must be under 500 characters.'), handleValidation, addComment);

export default router;
