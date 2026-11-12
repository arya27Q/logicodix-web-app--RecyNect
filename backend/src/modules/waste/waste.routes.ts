import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireTrustedOrigin } from '../../middlewares/origin.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { WasteController } from './waste.controller.js';
import { createCategorySchema, updateCategorySchema } from './waste.schemas.js';

const router = Router();
const controller = new WasteController();

// Rute publik untuk katalog & form pencocokan
router.get('/', controller.getCategories);
router.get('/categories', controller.getCategories);

// Rute terproteksi admin untuk pengelolaan master kategori (wajib sebelum :id)
router.get('/categories/manage', authMiddleware, roleMiddleware('admin'), controller.getAllCategoriesForAdmin);
router.post(
  '/categories',
  requireTrustedOrigin,
  authMiddleware,
  roleMiddleware('admin'),
  validateRequest(createCategorySchema),
  controller.createCategory,
);
router.patch(
  '/categories/:id',
  requireTrustedOrigin,
  authMiddleware,
  roleMiddleware('admin'),
  validateRequest(updateCategorySchema),
  controller.updateCategory,
);
router.put(
  '/categories/:id',
  requireTrustedOrigin,
  authMiddleware,
  roleMiddleware('admin'),
  validateRequest(updateCategorySchema),
  controller.updateCategory,
);
router.delete(
  '/categories/:id',
  requireTrustedOrigin,
  authMiddleware,
  roleMiddleware('admin'),
  controller.deleteCategory,
);

router.get('/categories/:id', controller.getCategoryById);

export default router;
