import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { authRateLimit } from '../../middlewares/rate-limit.middleware.js';
import { requireTrustedOrigin } from '../../middlewares/origin.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { loginSchema, verificationSchema } from '../auth/auth.schemas.js';
import { AdminController } from './admin.controller.js';

const router = Router();
const controller = new AdminController();

router.post('/login', requireTrustedOrigin, authRateLimit, validateRequest(loginSchema), controller.login);
router.use(authMiddleware, roleMiddleware('admin'));
router.get('/recyclers/pending', controller.getPendingRecyclers);
router.post('/recyclers/:id/verify', requireTrustedOrigin, validateRequest(verificationSchema), controller.verifyRecycler);

export default router;
