import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { logExperimentalResult, listFeedbackForRun } from '../controllers/feedback.controller.js';

const router = Router();

router.use(authenticate);

router.post('/', logExperimentalResult);
router.post('/experimental', logExperimentalResult);
router.get('/run/:runId', listFeedbackForRun);

export default router;
