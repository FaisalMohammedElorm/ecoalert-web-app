import { Router } from 'express';
import {
  listReports, getReport, createReport, updateReport, updateReportStatus,
  deleteReport, verifyReport, addComment,
} from '../controllers/reportController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

// Public reads (the map/feed is public)
router.get('/', listReports);
router.get('/:id', getReport);

// Authenticated actions
router.post('/', authRequired, createReport);
router.put('/:id', authRequired, updateReport);
router.put('/:id/status', authRequired, updateReportStatus);
router.delete('/:id', authRequired, deleteReport);
router.post('/:id/verify', authRequired, verifyReport);
router.post('/:id/comments', authRequired, addComment);

export default router;
