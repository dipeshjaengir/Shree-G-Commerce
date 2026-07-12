import express from 'express';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply auth protection globally to all cart routes
router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/:productId', removeFromCart);

export default router;
