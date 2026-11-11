import { Router } from 'express';
import { WasteController } from './waste.controller.js';

const router = Router();
const controller = new WasteController();

router.get('/', controller.getCategories);
router.get('/categories', controller.getCategories);

export default router;
