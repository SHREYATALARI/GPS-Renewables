import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  listMyProjects,
  createProject,
  getProject,
  inviteToProject,
} from '../controllers/project.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', listMyProjects);
router.post('/', createProject);
router.get('/:id', getProject);
router.post('/:id/invite', inviteToProject);

export default router;
