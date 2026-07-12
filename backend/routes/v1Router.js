import express from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import cartRoutes from './cartRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';
import orderRoutes from './orderRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import auditLogRoutes from './auditLogRoutes.js';
import { checkHealth } from '../controllers/healthController.js';

const router = express.Router();

router.get('/health', checkHealth);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/orders', orderRoutes);
router.use('/settings', settingsRoutes);
router.use('/admin/audit-logs', auditLogRoutes);

export default router;
