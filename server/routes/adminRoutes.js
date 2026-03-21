import express from 'express';
import {
  getAnalytics,
  getWinners,
  markWinnerPaid,
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { admin as adminMiddleware } from '../middleware/admin.js';

const router = express.Router();

router.get('/analytics', protect, adminMiddleware, getAnalytics);
router.get('/winners', protect, adminMiddleware, getWinners);
router.put('/winners/:id/pay', protect, adminMiddleware, markWinnerPaid);

export default router;
