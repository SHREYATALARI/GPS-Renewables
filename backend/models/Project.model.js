import mongoose from 'mongoose';

/**
 * Research workspace: ownerId + collaborator user IDs (no shared server session).
 * FUTURE: Real-time presence, granular permissions, org-scoped projects.
 */
const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    /** Canonical owner reference — use this for all new code */
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    /**
     * Collaborator user IDs (accepted members). Invites are explicit adds only.
     * FUTURE: pendingInvites subdoc collection for email-token flow
     */
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    version: { type: String, default: '1.0.0' },
  },
  { timestamps: true }
);

projectSchema.index({ collaborators: 1 });

export default mongoose.model('Project', projectSchema);
