import { Router } from 'express';
import { AdminController } from './admin.controller.js';

const router = Router();
const controller = new AdminController();

router.post('/recyclers/:id/verify', controller.verifyRecycler);

export default router;

