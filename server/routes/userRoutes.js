import express from 'express';
import {
  subscribeUser,
  cancelSubscription,
  getSubscription,
  updateCharity,
  getUsers,
  adminToggleSubscription,
  adminToggleRole,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { admin as adminMiddleware } from '../middleware/admin.js';

const router = express.Router();

router.post('/subscribe', protect, subscribeUser);
router.put('/cancel', protect, cancelSubscription);
router.get('/subscription', protect, getSubscription);
router.put('/charity', protect, updateCharity);

// Admin routes
router.get('/', protect, adminMiddleware, getUsers);
router.put('/:id/subscribe', protect, adminMiddleware, adminToggleSubscription);
router.put('/:id/role', protect, adminMiddleware, adminToggleRole);

export default router;
