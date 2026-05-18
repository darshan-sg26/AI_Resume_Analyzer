import express from 'express';
import { analyzeResume, getUserStats } from '../controllers/analyzeController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.single('resume'), analyzeResume);
router.get('/stats', protect, getUserStats);

export default router;
