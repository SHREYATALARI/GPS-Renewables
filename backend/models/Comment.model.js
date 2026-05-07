import mongoose from 'mongoose';

/**
 * Project-scoped research comments for multi-user collaboration.
 * FUTURE: Threading, emoji reactions, edit history, soft delete.
 */
const commentSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    researchRunId: { type: mongoose.Schema.Types.ObjectId, ref: 'ResearchRun' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

commentSchema.index({ projectId: 1, createdAt: -1 });

export default mongoose.model('Comment', commentSchema);
