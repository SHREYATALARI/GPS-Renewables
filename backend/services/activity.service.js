import ActivityLog from '../models/ActivityLog.model.js';

/**
 * Central place to record auditable events.
 * FUTURE: Fan-out to message bus (Redis/RabbitMQ), webhooks, SIEM.
 */
export async function logActivity({ actorId, projectId, researchRunId, action, summary, meta }) {
  return ActivityLog.create({
    actor: actorId,
    project: projectId,
    researchRun: researchRunId,
    action,
    summary,
    meta: meta || {},
  });
}

export async function listActivityForUser(userId, { limit = 50 } = {}) {
  return ActivityLog.find({ actor: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('project', 'name')
    .lean();
}

export async function listActivityForProject(projectId, { limit = 100 } = {}) {
  return ActivityLog.find({ project: projectId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('actor', 'name email')
    .lean();
}
