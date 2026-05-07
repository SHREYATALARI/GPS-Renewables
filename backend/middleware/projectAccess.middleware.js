import { getProjectIfMember } from '../services/projectAccess.service.js';

/**
 * Resolves projectId from route params (`projectId`, `id`) or JSON body.
 * Attaches req.projectAccess, req.project. Fully request-scoped.
 */
export async function requireProjectAccess(req, res, next) {
  try {
    const projectId =
      req.params.projectId ?? req.params.id ?? req.body?.projectId;

    if (!projectId) {
      return res.status(400).json({ message: 'projectId required' });
    }

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const access = await getProjectIfMember(projectId, userId);
    if (!access) {
      return res.status(404).json({ message: 'Project not found' });
    }

    req.projectAccess = access;
    req.project = access.project;
    next();
  } catch (e) {
    next(e);
  }
}
