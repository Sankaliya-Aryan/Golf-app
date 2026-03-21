import express from 'express';
import {
  getCharities,
  createCharity,
  updateCharity,
  deleteCharity,
} from '../controllers/charityController.js';
import { protect } from '../middleware/auth.js';
import { admin as adminMiddleware } from '../middleware/admin.js';

const router = express.Router();

router.route('/')
  .get(getCharities)
  .post(protect, adminMiddleware, createCharity);
  
router.route('/:id')
  .put(protect, adminMiddleware, updateCharity)
  .delete(protect, adminMiddleware, deleteCharity);

export default router;
