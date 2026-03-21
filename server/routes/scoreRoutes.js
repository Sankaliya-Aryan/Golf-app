import express from 'express';
import {
  addScore,
  getMyScores,
  getAllScores,
} from '../controllers/scoreController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

router.route('/').post(protect, addScore).get(protect, getMyScores);
router.get('/all', protect, admin, getAllScores);

export default router;
