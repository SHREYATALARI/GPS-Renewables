import Project from '../models/Project.model.js';

/**
 * Resolve canonical owner id (supports legacy `owner` field until DB migrated).
 */
export function resolveOwnerId(project) {
  if (!project) return null;
  return project.ownerId || project.owner;
}

/**
 * Normalize collaborator list to an array of ObjectIds (legacy subdocs or plain ids).
 */
export function normalizeCollaboratorIds(collaborators) {
  if (!collaborators?.length) return [];
  const first = collaborators[0];
  if (first && typeof first === 'object' && first.user) {
    return collaborators.map((c) => c.user).filter(Boolean);
  }
  return collaborators.filter(Boolean);
}

/**
 * Mongo query: projects where user is owner or collaborator (legacy + new shapes).
 */
export function projectMembershipOrClause(userId) {
  return {
    $or: [
      { ownerId: userId },
      { owner: userId },
      { collaborators: userId },
      { 'collaborators.user': userId },
    ],
  };
}

/**
 * Returns { project, isOwner } or null. Stateless; safe under concurrent requests.
 * FUTURE: Role-based checks (viewer vs editor), org tenancy.
 */
export async function getProjectIfMember(projectId, userId) {
  const project = await Project.findById(projectId);
  if (!project) return null;
  const ownerOid = resolveOwnerId(project);
  const isOwner = ownerOid?.toString() === userId.toString();
  const collabIds = normalizeCollaboratorIds(project.collaborators);
  const isCollab = collabIds.some((id) => id.toString() === userId.toString());
  if (!isOwner && !isCollab) return null;
  return { project, isOwner: !!isOwner };
}
