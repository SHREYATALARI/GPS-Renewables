import { getProjectIfMember } from '../services/projectAccess.service.js';
import { listVersionHistory, recordVersionEvent } from '../services/versionHistory.service.js';

export async function getVersionHistory(req, res, next) {
  try {
    const { projectId } = req.params;
    const access = await getProjectIfMember(projectId, req.userId);
    if (!access) return res.status(404).json({ message: 'Project not found' });
    const history = await listVersionHistory(projectId, 120);
    res.json({ history });
  } catch (e) {
    next(e);
  }
}

export async function retrainModel(req, res, next) {
  try {
    const { projectId } = req.params;
    const access = await getProjectIfMember(projectId, req.userId);
    if (!access) return res.status(404).json({ message: 'Project not found' });
    const project = access.project;
    const prevVersion = project.version || '1.0.0';
    const nextVersion = bumpPatchVersion(project.version);
    project.version = nextVersion;
    await project.save();

    await recordVersionEvent({
      projectId,
      actorId: req.userId,
      type: 'retrain',
      label: `Retraining simulation completed`,
      version: nextVersion,
      meta: {
        strategy: 'mock-feedback-loop-v1',
        previousModelVersion: `mock-model-${prevVersion}`,
        newModelVersion: `mock-model-${nextVersion}`,
        calibrationDelta: Number((Math.random() * 0.04 + 0.01).toFixed(4)),
        updatedConfidenceScore: Number((0.83 + Math.random() * 0.08).toFixed(3)),
        experimentsUsed: 8 + Math.floor(Math.random() * 12),
        retrainingTimestamp: new Date().toISOString(),
      },
    });

    res.json({
      ok: true,
      modelVersion: `mock-model-${nextVersion}`,
      projectVersion: nextVersion,
    });
  } catch (e) {
    next(e);
  }
}

function bumpPatchVersion(v) {
  if (!v || typeof v !== 'string') return '1.0.1';
  const parts = v.split('.').map(Number);
  if (parts.length >= 3 && !parts.some(Number.isNaN)) {
    parts[2] += 1;
    return parts.join('.');
  }
  return `${v}.1`;
}
