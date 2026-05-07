import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    structure: String,
    activityScore: Number,
    selectivity: Number,
    stability: Number,
    sourceDatabase: String,
    kind: { type: String, enum: ['retrieved', 'generated'], required: true },
    rank: Number,
  },
  { _id: false }
);

const pipelineMetaSchema = new mongoose.Schema(
  {
    modelVersion: String,
    databasesUsed: [String],
    simulatedModelImprovement: { type: Number, default: 0 },
  },
  { _id: false }
);

/**
 * One isolated pipeline execution — all payload under `results` to avoid cross-request bleed.
 * Indices support user-scoped and project-scoped listing without table scans.
 */
const researchRunSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    /** User who initiated this run (audit + quotas) */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reactionInput: { type: String, required: true, trim: true },
    results: {
      retrievedCandidates: [candidateSchema],
      generatedCandidates: [candidateSchema],
      predictions: [candidateSchema],
      pipelineMeta: pipelineMetaSchema,
    },
  },
  { timestamps: true }
);

researchRunSchema.index({ projectId: 1, createdAt: -1 });
researchRunSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('ResearchRun', researchRunSchema);
