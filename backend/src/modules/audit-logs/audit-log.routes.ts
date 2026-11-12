import { Router } from 'express';
import { AuditLogController } from './audit-log.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';

const router = Router();
const controller = new AuditLogController();

// Endpoint audit logs hanya bisa diakses oleh admin berwenang
router.get('/', authMiddleware, roleMiddleware('admin'), controller.getLogs);

export default router;
