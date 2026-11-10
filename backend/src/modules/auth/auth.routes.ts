import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
import { authRateLimit } from '../../middlewares/rate-limit.middleware.js';
import { requireTrustedOrigin } from '../../middlewares/origin.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { AuthController } from './auth.controller.js';
import { loginSchema, passwordChangeSchema, registerSchema } from './auth.schemas.js';

const router = Router();
const controller = new AuthController();

router.post('/register', requireTrustedOrigin, authRateLimit, validateRequest(registerSchema), controller.register);
router.post('/login', requireTrustedOrigin, authRateLimit, validateRequest(loginSchema), controller.login);
router.get('/me', authMiddleware, roleMiddleware('user', 'recycler', 'admin'), controller.currentSession);
router.post('/logout', requireTrustedOrigin, controller.logout);
router.patch('/password', requireTrustedOrigin, authRateLimit, authMiddleware, roleMiddleware('user', 'recycler'), validateRequest(passwordChangeSchema), controller.changePassword);

export default router;
