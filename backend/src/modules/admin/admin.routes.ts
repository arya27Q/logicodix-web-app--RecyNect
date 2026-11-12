import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { authRateLimit } from '../../middlewares/rate-limit.middleware.js';
import { requireTrustedOrigin } from '../../middlewares/origin.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { loginSchema, passwordChangeSchema, verificationSchema } from '../auth/auth.schemas.js';
import { AdminController } from './admin.controller.js';
import { updateAdminProfileSchema, updateRecyclerStatusSchema } from './admin.schemas.js';

const router = Router();
const controller = new AdminController();

router.post('/login', requireTrustedOrigin, authRateLimit, validateRequest(loginSchema), controller.login);

router.use(authMiddleware, roleMiddleware('admin'));

// Overview & analitik platform
router.get('/stats', controller.getStats);
router.get('/activity', controller.getActivity);

// Manajemen profil & keamanan kata sandi admin
router.get('/profile', controller.getProfile);
router.patch('/profile', requireTrustedOrigin, validateRequest(updateAdminProfileSchema), controller.updateProfile);
router.patch('/password', requireTrustedOrigin, authRateLimit, validateRequest(passwordChangeSchema), controller.changePassword);

// Verifikasi & moderasi mitra pengelola
router.get('/recyclers', controller.getRecyclers);
router.get('/recyclers/pending', controller.getPendingRecyclers);
router.post('/recyclers/:id/verify', requireTrustedOrigin, validateRequest(verificationSchema), controller.verifyRecycler);
router.patch('/recyclers/:id/status', requireTrustedOrigin, validateRequest(updateRecyclerStatusSchema), controller.updateRecyclerStatus);

// Audit kewajaran harga & harga usang
router.get('/price-audit', controller.getPriceAudit);

export default router;
