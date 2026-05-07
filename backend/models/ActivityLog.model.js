import mongoose from 'mongoose';

/**
 * Audit trail: user actions, research history hooks, version bumps.
 * FUTURE: Stream to analytics warehouse, immutable ledger, GDPR tooling.
 */
const activityLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    researchRun: { type: mongoose.Schema.Types.ObjectId, ref: 'ResearchRun' },
    action: {
      type: String,
      required: true,
      /** e.g. login, project_created, collaborator_invited, research_run, feedback_logged */
    },
    summary: { type: String, default: '' },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

activityLogSchema.index({ project: 1, createdAt: -1 });
activityLogSchema.index({ actor: 1, createdAt: -1 });

export default mongoose.model('ActivityLog', activityLogSchema);
