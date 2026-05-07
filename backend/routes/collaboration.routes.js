import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { addComment, listComments } from '../controllers/collaboration.controller.js';

const router = Router();

router.use(authenticate);
router.get('/project/:projectId/comments', listComments);
router.post('/project/:projectId/comments', addComment);

export default router;
