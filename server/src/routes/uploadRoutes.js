import { Router } from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { authRequired } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/', authRequired, upload.single('image'), uploadImage);

export default router;
