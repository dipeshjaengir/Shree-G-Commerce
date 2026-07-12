import express from 'express';
import { getSystemSettings, updateSystemSettings } from '../controllers/settingsController.js';
import { protect, checkPermission } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getSystemSettings);
router.put('/', checkPermission('settings:write'), updateSystemSettings);

export default router;
