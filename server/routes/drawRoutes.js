import express from 'express';
import {
  generateDraw,
  getLatestDraw,
  getDrawHistory,
  reopenEntries,
  getTimerConfig,
  updateTimerConfig
} from '../controllers/drawController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

router.route('/').post(protect, admin, generateDraw);
router.route('/timer').get(protect, getTimerConfig).put(protect, admin, updateTimerConfig);
router.route('/reopen').put(protect, admin, reopenEntries);
router.route('/latest').get(protect, getLatestDraw);
router.route('/history').get(protect, getDrawHistory);

export default router;
