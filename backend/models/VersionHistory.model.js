import mongoose from 'mongoose';

/**
 * Immutable project event timeline for auditability.
 * FUTURE: Signed event hashes, branching snapshots, rollback markers.
 */
const versionHistorySchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['pipeline_run', 'feedback_logged', 'export', 'comment', 'retrain', 'invite', 'project_update'],
      required: true,
    },
    label: { type: String, required: true, trim: true },
    version: { type: String, default: '' },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

versionHistorySchema.index({ projectId: 1, createdAt: -1 });

export default mongoose.model('VersionHistory', versionHistorySchema);
