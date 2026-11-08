import { Router } from 'express';
import { AdminController } from './admin.controller.js';

const router = Router();
const controller = new AdminController();

// Pintu masuk khusus admin internal (terpisah dari user)
router.post('/login', controller.login);
router.post('/recyclers/:id/verify', controller.verifyRecycler);

export default router;
