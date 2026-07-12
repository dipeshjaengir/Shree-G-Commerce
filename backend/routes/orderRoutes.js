import express from 'express';
import { 
  createOrder, 
  getMyOrders, 
  getOrderDetails, 
  cancelOrder,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, checkPermission } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply auth protection globally to all order routes
router.use(protect);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderDetails);
router.patch('/:id/cancel', cancelOrder);

// Admin status update endpoint
router.patch('/:id/status', checkPermission('orders:write'), updateOrderStatus);

export default router;
