import { Router } from 'express';
import { MatchingController } from './matching.controller.js';

const router = Router();
const controller = new MatchingController();

router.post('/', controller.runMatching);
router.get('/:sessionId', controller.getSession);

export default router;
