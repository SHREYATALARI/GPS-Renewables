import { listActivityForUser, listActivityForProject } from '../services/activity.service.js';
import { getProjectIfMember } from '../services/projectAccess.service.js';

export async function myActivity(req, res, next) {
  try {
    const rows = await listActivityForUser(req.userId, { limit: 80 });
    res.json({
      activity: rows.map((a) => ({
        id: a._id,
        action: a.action,
        summary: a.summary,
        meta: a.meta,
        project: a.project,
        createdAt: a.createdAt,
      })),
    });
  } catch (e) {
    next(e);
  }
}

export async function projectActivity(req, res, next) {
  try {
    const access = await getProjectIfMember(req.params.projectId, req.userId);
    if (!access) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const rows = await listActivityForProject(req.params.projectId, { limit: 100 });
    res.json({
      activity: rows.map((a) => ({
        id: a._id,
        action: a.action,
        summary: a.summary,
        meta: a.meta,
        actor: a.actor,
        createdAt: a.createdAt,
      })),
    });
  } catch (e) {
    next(e);
  }
}
