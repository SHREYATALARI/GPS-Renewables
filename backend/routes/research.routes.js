import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { runResearch, listRunsForProject, getRun } from '../controllers/research.controller.js';

const router = Router();

router.use(authenticate);

/**
 * Ordered before legacy `/:runId` so paths like `projects` never parse as ObjectIds incorrectly.
 * New canonical routes:
 *   POST /research/run
 *   GET  /research/projects/:projectId/runs
 *   GET  /research/runs/:runId
 */
router.post('/run', runResearch);
router.get('/projects/:projectId/runs', listRunsForProject);
router.get('/runs/:runId', getRun);

/** @deprecated — use /projects/:projectId/runs */
router.get('/project/:projectId', listRunsForProject);
/** @deprecated — use /runs/:runId */
router.get('/:runId', getRun);

export default router;
