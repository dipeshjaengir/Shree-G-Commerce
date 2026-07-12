import express from 'express';
import { getAuditLogs } from '../controllers/auditLogController.js';
import { protect, checkPermission } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', checkPermission('reports:read'), getAuditLogs);

export default router;
