import mongoose from 'mongoose';

/**
 * Feedback records — always scoped by researchRunId + userId + projectId.
 * Collection name kept for backward compatibility with existing deployments.
 * FUTURE: Batch labeling workflows, signed uploads from instruments.
 */
const experimentalResultSchema = new mongoose.Schema(
  {
    researchRunId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResearchRun',
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    candidateId: { type: String, required: true },
    candidateName: String,
    predicted: {
      activityScore: Number,
      selectivity: Number,
      stability: Number,
    },
    actualValues: {
      activityScore: Number,
      selectivity: Number,
      stability: Number,
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

experimentalResultSchema.index({ researchRunId: 1, userId: 1 });

export default mongoose.model('Feedback', experimentalResultSchema, 'experimentalresults');
