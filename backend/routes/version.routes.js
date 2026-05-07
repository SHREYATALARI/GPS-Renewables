import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getVersionHistory, retrainModel } from '../controllers/version.controller.js';

const router = Router();

router.use(authenticate);
router.get('/project/:projectId', getVersionHistory);
router.post('/project/:projectId/retrain', retrainModel);

export default router;
