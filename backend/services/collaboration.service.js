import User from '../models/User.model.js';
import Project from '../models/Project.model.js';
import { logActivity } from './activity.service.js';
import { resolveOwnerId, normalizeCollaboratorIds } from './projectAccess.service.js';

/**
 * Invite flow: append collaborator userId (registered users only).
 * FUTURE: Email invites, pending tokens, expiry — still append-only on collaborators[].
 */
export async function inviteCollaborator({ projectId, inviterId, inviteeEmail }) {
  const project = await Project.findById(projectId);
  if (!project) {
    const err = new Error('Project not found');
    err.status = 404;
    throw err;
  }
  const ownerId = resolveOwnerId(project)?.toString();
  if (ownerId !== inviterId.toString()) {
    const err = new Error('Only the project owner can invite collaborators');
    err.status = 403;
    throw err;
  }
  const invitee = await User.findOne({ email: inviteeEmail.toLowerCase().trim() });
  if (!invitee) {
    const err = new Error('No user registered with that email');
    err.status = 404;
    throw err;
  }
  if (invitee._id.toString() === ownerId) {
    const err = new Error('Owner is already on the project');
    err.status = 400;
    throw err;
  }
  const existing = normalizeCollaboratorIds(project.collaborators);
  if (existing.some((id) => id.toString() === invitee._id.toString())) {
    const err = new Error('User is already a collaborator');
    err.status = 400;
    throw err;
  }
  project.collaborators.push(invitee._id);
  await project.save();

  await logActivity({
    actorId: inviterId,
    projectId: project._id,
    action: 'collaborator_invited',
    summary: `Invited ${invitee.email} to ${project.name}`,
    meta: { inviteeId: invitee._id.toString() },
  });

  return project;
}
