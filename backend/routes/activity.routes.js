import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { myActivity, projectActivity } from '../controllers/activity.controller.js';

const router = Router();

router.use(authenticate);

router.get('/me', myActivity);
router.get('/project/:projectId', projectActivity);

export default router;
