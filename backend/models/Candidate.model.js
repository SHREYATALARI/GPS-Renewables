import mongoose from 'mongoose';

/**
 * Optional normalized candidate store.
 * Current prototype keeps candidates embedded per run; this model is future-ready for
 * cross-run indexing, simulation scheduling, and enterprise analytics.
 */
const candidateSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    researchRunId: { type: mongoose.Schema.Types.ObjectId, ref: 'ResearchRun', required: true, index: true },
    candidateId: { type: String, required: true, index: true },
    name: String,
    composition: String,
    structure: String,
    activityScore: Number,
    selectivity: Number,
    stability: Number,
    confidenceScore: Number,
    sourceDatabase: String,
    kind: { type: String, enum: ['retrieved', 'generated'], default: 'generated' },
  },
  { timestamps: true }
);

candidateSchema.index({ projectId: 1, candidateId: 1 }, { unique: false });

export default mongoose.model('Candidate', candidateSchema);
