import Comment from '../models/Comment.model.js';
import { getProjectIfMember } from '../services/projectAccess.service.js';
import { logActivity } from '../services/activity.service.js';
import { recordVersionEvent } from '../services/versionHistory.service.js';

export async function listComments(req, res, next) {
  try {
    const { projectId } = req.params;
    const access = await getProjectIfMember(projectId, req.userId);
    if (!access) return res.status(404).json({ message: 'Project not found' });

    const comments = await Comment.find({ projectId })
      .sort({ createdAt: -1 })
      .limit(80)
      .populate('userId', 'name email role')
      .lean();

    res.json({ comments });
  } catch (e) {
    next(e);
  }
}

export async function addComment(req, res, next) {
  try {
    const { projectId } = req.params;
    const { text, researchRunId, mentions = [] } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: 'Comment text required' });
    const access = await getProjectIfMember(projectId, req.userId);
    if (!access) return res.status(404).json({ message: 'Project not found' });

    const comment = await Comment.create({
      projectId,
      researchRunId: researchRunId || undefined,
      userId: req.userId,
      text: text.trim(),
      mentions,
    });

    await logActivity({
      actorId: req.userId,
      projectId,
      researchRunId: researchRunId || undefined,
      action: 'comment_added',
      summary: `Added collaboration comment`,
    });

    await recordVersionEvent({
      projectId,
      actorId: req.userId,
      type: 'comment',
      label: 'Collaboration comment added',
      meta: {
        commentId: comment._id.toString(),
        text: comment.text,
        mentions: Array.isArray(mentions) ? mentions : [],
        researchRunId: researchRunId || null,
        timestamp: new Date().toISOString(),
      },
    });

    res.status(201).json({ comment });
  } catch (e) {
    next(e);
  }
}
