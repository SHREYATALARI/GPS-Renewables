import VersionHistory from '../models/VersionHistory.model.js';

/**
 * Centralized version timeline writer.
 * Keeps request-scoped event logging explicit and composable.
 */
export async function recordVersionEvent({ projectId, actorId, type, label, version = '', meta = {} }) {
  return VersionHistory.create({
    projectId,
    actorId,
    type,
    label,
    version,
    meta,
  });
}

export async function listVersionHistory(projectId, limit = 120) {
  return VersionHistory.find({ projectId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('actorId', 'name email role')
    .lean();
}
