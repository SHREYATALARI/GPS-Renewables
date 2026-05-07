import mongoose from 'mongoose';
import ResearchRun from '../models/ResearchRun.model.js';
import Project from '../models/Project.model.js';
import { getProjectIfMember } from '../services/projectAccess.service.js';
import { runResearchPipeline } from '../ai-engine/research.pipeline.js';
import { logActivity } from '../services/activity.service.js';
import { recordVersionEvent } from '../services/versionHistory.service.js';

export async function runResearch(req, res, next) {
  try {
    const startedAt = Date.now();
    const { projectId, targetReaction } = req.body;
    if (!projectId || !targetReaction?.trim()) {
      return res.status(400).json({ message: 'projectId and targetReaction required' });
    }
    const access = await getProjectIfMember(projectId, req.userId);
    if (!access) {
      return res.status(404).json({ message: 'Project not found' });
    }

    /** Request-local pipeline — no globals; safe under parallel POSTs from many users. */
    const result = await runResearchPipeline({
      targetReaction: targetReaction.trim(),
      generativeCount: 5,
    });

    const doc = await ResearchRun.create({
      projectId,
      userId: req.userId,
      reactionInput: targetReaction.trim(),
      results: {
        retrievedCandidates: result.retrievedCandidates,
        generatedCandidates: result.generatedCandidates,
        predictions: result.predictions,
        pipelineMeta: result.pipelineMeta,
      },
    });

    const proj = await Project.findById(projectId);
    if (proj) {
      proj.version = bumpPatchVersion(proj.version);
      await proj.save();
    }

    await logActivity({
      actorId: req.userId,
      projectId,
      researchRunId: doc._id,
      action: 'research_run',
      summary: `Research pipeline for "${targetReaction.trim().slice(0, 80)}..."`,
      meta: {
        runId: doc._id.toString(),
        databases: result.pipelineMeta.databasesUsed,
      },
    });
    await recordVersionEvent({
      projectId,
      actorId: req.userId,
      type: 'pipeline_run',
      label: `AI discovery run completed`,
      version: proj?.version || '',
      meta: {
        runId: doc._id.toString(),
        targetReaction: targetReaction.trim(),
        databasesQueried: result.pipelineMeta?.databasesUsed || [],
        retrievedCount: result.retrievedCandidates?.length || 0,
        generatedCount: result.generatedCandidates?.length || 0,
        bestCandidate: result.predictions?.[0]?.name || 'N/A',
        runtimeMs: Date.now() - startedAt,
      },
    });

    res.status(201).json({ run: serializeRun(doc) });
  } catch (e) {
    next(e);
  }
}

function bumpPatchVersion(v) {
  if (!v || typeof v !== 'string') return '1.0.1';
  const parts = v.split('.').map(Number);
  if (parts.length >= 3 && !parts.some(Number.isNaN)) {
    parts[2] += 1;
    return parts.join('.');
  }
  return `${v}.1`;
}

export async function listRunsForProject(req, res, next) {
  try {
    const access = await getProjectIfMember(req.params.projectId, req.userId);
    if (!access) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const query = {
      $or: [{ projectId: req.params.projectId }, { project: req.params.projectId }],
    };
    const runs = await ResearchRun.find(query)
      .sort({ createdAt: -1 })
      .limit(40)
      .populate('userId', 'name email')
      .lean();

    res.json({ runs: runs.map(serializeRunLean) });
  } catch (e) {
    next(e);
  }
}

export async function getRun(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.runId)) {
      return res.status(404).json({ message: 'Run not found' });
    }
    const run = await ResearchRun.findById(req.params.runId).populate('userId', 'name email').lean();
    if (!run) {
      return res.status(404).json({ message: 'Run not found' });
    }
    const projectRef = run.projectId || run.project;
    const access = await getProjectIfMember(projectRef, req.userId);
    if (!access) {
      return res.status(404).json({ message: 'Run not found' });
    }
    res.json({ run: serializeRunLean(run) });
  } catch (e) {
    next(e);
  }
}

function serializeRun(doc) {
  const o = doc.toObject ? doc.toObject() : doc;
  return serializeRunLean(o);
}

function serializeRunLean(o) {
  const results = o.results || {
    retrievedCandidates: o.retrievedCandidates,
    generatedCandidates: o.generatedCandidates,
    predictions: o.predictions,
    pipelineMeta: o.pipelineMeta,
  };
  const projectRef = o.projectId || o.project;
  const userRef = o.userId || o.createdBy;
  const reaction = o.reactionInput || o.targetReaction;
  const meta = results.pipelineMeta || o.pipelineMeta || {};

  return {
    id: o._id,
    projectId: projectRef,
    project: projectRef,
    userId: userRef,
    createdBy: userRef,
    reactionInput: reaction,
    targetReaction: reaction,
    results,
    retrievedCandidates: results.retrievedCandidates,
    generatedCandidates: results.generatedCandidates,
    predictions: results.predictions,
    pipelineMeta: meta,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}
