import express from 'express';
import {
  generateDraw,
  getLatestDraw,
} from '../controllers/drawController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

router.route('/').post(protect, admin, generateDraw);
router.route('/latest').get(protect, getLatestDraw);

export default router;
