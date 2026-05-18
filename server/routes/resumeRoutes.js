import express from 'express';
import { generateResumePdf } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate/:historyId', protect, generateResumePdf);

export default router;
