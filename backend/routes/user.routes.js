import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { searchUsers } from '../controllers/user.controller.js';

const router = Router();

router.get('/search', authenticate, searchUsers);

export default router;
