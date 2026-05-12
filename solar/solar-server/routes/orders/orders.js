import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getOrdersByUser,
  getOrderStats,
} from '../../controllers/orders/orderController.js';
import { protect, authorize } from '../../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllOrders);
router.post('/', createOrder);
router.get('/stats', authorize('admin'), getOrderStats);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', authorize('admin'), deleteOrder);
router.get('/user/:userId', getOrdersByUser);

export default router;
