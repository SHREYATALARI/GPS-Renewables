import Project from '../models/Project.model.js';
import { getProjectIfMember, projectMembershipOrClause } from '../services/projectAccess.service.js';
import { inviteCollaborator } from '../services/collaboration.service.js';
import { logActivity } from '../services/activity.service.js';
import { recordVersionEvent } from '../services/versionHistory.service.js';

function bumpPatchVersion(v) {
  if (!v || typeof v !== 'string') return '1.0.1';
  const parts = v.split('.').map(Number);
  if (parts.length >= 3 && !parts.some(Number.isNaN)) {
    parts[2] += 1;
    return parts.join('.');
  }
  return `${v}.1`;
}

/** Stable JSON shape: { user, status } for the existing UI. */
function formatCollaboratorsForApi(collaborators) {
  if (!collaborators?.length) return [];
  const first = collaborators[0];
  if (first && typeof first === 'object' && (first.email || first.name) && !first.user) {
    return collaborators.map((u) => ({ user: u, status: 'accepted' }));
  }
  return collaborators.map((c) => {
    if (c?.user) return { user: c.user, status: c.status || 'accepted' };
    return { user: c, status: 'accepted' };
  });
}

export async function listMyProjects(req, res, next) {
  try {
    const uid = req.user._id;
    const projects = await Project.find(projectMembershipOrClause(uid))
      .populate('ownerId', 'name email')
      .populate('collaborators', 'name email role')
      .sort({ updatedAt: -1 })
      .lean();

    res.json({
      projects: projects.map((p) => ({
        id: p._id,
        name: p.name,
        description: p.description,
        version: p.version,
        ownerId: p.ownerId || p.owner,
        owner: p.ownerId || p.owner,
        collaborators: formatCollaboratorsForApi(p.collaborators),
        updatedAt: p.updatedAt,
        createdAt: p.createdAt,
      })),
    });
  } catch (e) {
    next(e);
  }
}

export async function createProject(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ message: 'Project name required' });
    }
    const project = await Project.create({
      name: name.trim(),
      description: description || '',
      ownerId: req.user._id,
      collaborators: [],
      version: '1.0.0',
    });

    await logActivity({
      actorId: req.user._id,
      projectId: project._id,
      action: 'project_created',
      summary: `Created project "${project.name}"`,
    });
    await recordVersionEvent({
      projectId: project._id,
      actorId: req.user._id,
      type: 'project_update',
      label: 'Project initialized',
      version: project.version,
    });

    res.status(201).json({
      project: {
        id: project._id,
        name: project.name,
        description: project.description,
        version: project.version,
        ownerId: project.ownerId,
      },
    });
  } catch (e) {
    next(e);
  }
}

export async function getProject(req, res, next) {
  try {
    const access = await getProjectIfMember(req.params.id, req.user._id);
    if (!access) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const p = await Project.findById(req.params.id)
      .populate('ownerId', 'name email')
      .populate('collaborators', 'name email role')
      .lean();

    res.json({
      project: {
        id: p._id,
        name: p.name,
        description: p.description,
        version: p.version,
        ownerId: p.ownerId,
        owner: p.ownerId,
        collaborators: formatCollaboratorsForApi(p.collaborators),
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      },
    });
  } catch (e) {
    next(e);
  }
}

export async function inviteToProject(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email required' });
    }
    await inviteCollaborator({
      projectId: req.params.id,
      inviterId: req.user._id,
      inviteeEmail: email,
    });

    const project = await Project.findById(req.params.id);
    project.version = bumpPatchVersion(project.version);
    await project.save();

    await logActivity({
      actorId: req.user._id,
      projectId: project._id,
      action: 'project_version_updated',
      summary: `Project "${project.name}" updated to v${project.version} (invite)`,
      meta: { version: project.version },
    });
    await recordVersionEvent({
      projectId: project._id,
      actorId: req.user._id,
      type: 'invite',
      label: `Collaborator invited`,
      version: project.version,
      meta: { email },
    });

    res.json({ ok: true });
  } catch (e) {
    if (e.status) return res.status(e.status).json({ message: e.message });
    next(e);
  }
}
