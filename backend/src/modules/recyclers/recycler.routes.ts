import { Router } from 'express';
import { RecyclerController } from './recycler.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';

const router = Router();
const controller = new RecyclerController();

// Protected Recycler Material Management (wajib sebelum :id)
router.get('/materials/me', authMiddleware, roleMiddleware('recycler'), controller.getMyMaterials);
router.post('/materials', authMiddleware, roleMiddleware('recycler'), controller.createMaterial);
router.patch('/materials/:id', authMiddleware, roleMiddleware('recycler'), controller.updateMaterial);
router.delete('/materials/:id', authMiddleware, roleMiddleware('recycler'), controller.deleteMaterial);

// Public Recycler Directory
router.get('/', controller.getAll);
router.get('/:id', controller.getById);

export default router;
