import ExperimentalResult from '../models/ExperimentalResult.model.js';
import ResearchRun from '../models/ResearchRun.model.js';
import { getProjectIfMember } from '../services/projectAccess.service.js';
import { logActivity } from '../services/activity.service.js';
import { computeSimulatedImprovement } from '../ai-engine/feedback.calibration.js';
import { getPredictions, getResults } from '../services/researchRun.helpers.js';
import { recordVersionEvent } from '../services/versionHistory.service.js';

export async function logExperimentalResult(req, res, next) {
  try {
    const {
      researchRunId,
      candidateId,
      candidateName,
      predicted,
      actualValues,
      actual,
      notes,
    } = req.body;
    const measured = actualValues ?? actual;

    if (!researchRunId || !candidateId || !measured) {
      return res.status(400).json({
        message: 'researchRunId, candidateId, and actualValues required',
      });
    }

    const run = await ResearchRun.findById(researchRunId).lean();
    if (!run) {
      return res.status(404).json({ message: 'Research run not found' });
    }

    const projectRef = run.projectId || run.project;
    const access = await getProjectIfMember(projectRef, req.userId);
    if (!access) {
      return res.status(404).json({ message: 'Research run not found' });
    }

    const preds = getPredictions(run);
    const pred =
      predicted ||
      (() => {
        const hit = preds.find((p) => p.id === candidateId);
        return hit
          ? {
              activityScore: hit.activityScore,
              selectivity: hit.selectivity,
              stability: hit.stability,
            }
          : {};
      })();

    const row = await ExperimentalResult.create({
      researchRunId,
      projectId: projectRef,
      userId: req.userId,
      candidateId,
      candidateName: candidateName || '',
      predicted: pred,
      actualValues: measured,
      notes: notes || '',
    });

    const all = await ExperimentalResult.find({
      $or: [{ researchRunId }, { researchRun: researchRunId }],
    }).lean();
    const improvement = computeSimulatedImprovement(all);

    const results = getResults(run);
    results.pipelineMeta = results.pipelineMeta || {};
    results.pipelineMeta.simulatedModelImprovement =
      (results.pipelineMeta.simulatedModelImprovement || 0) + improvement;

    await ResearchRun.updateOne(
      { _id: researchRunId },
      {
        $set: {
          results: {
            retrievedCandidates: results.retrievedCandidates,
            generatedCandidates: results.generatedCandidates,
            predictions: results.predictions,
            pipelineMeta: results.pipelineMeta,
          },
        },
      }
    );

    await logActivity({
      actorId: req.userId,
      projectId: projectRef,
      researchRunId: run._id,
      action: 'feedback_logged',
      summary: `Logged lab results for candidate ${candidateId}`,
      meta: { improvementDelta: improvement },
    });
    await recordVersionEvent({
      projectId: projectRef,
      actorId: req.userId,
      type: 'feedback_logged',
      label: `Experimental feedback logged`,
      meta: {
        researchRunId: run._id.toString(),
        candidateId,
        candidateName: candidateName || pred?.name || candidateId,
        actualActivity: measured?.activityScore ?? null,
        actualSelectivity: measured?.selectivity ?? null,
        actualStability: measured?.stability ?? null,
        predictedActivity: pred?.activityScore ?? null,
        predictedSelectivity: pred?.selectivity ?? null,
        predictedStability: pred?.stability ?? null,
        discrepancyPct: Number(
          (
            ((measured?.activityScore ?? 0) - (pred?.activityScore ?? 0)) /
            Math.max(0.001, pred?.activityScore ?? 0.001)
          ).toFixed(4)
        ),
        calibrationAdjustment: Number(improvement.toFixed(4)),
        labNotes: notes || '',
        timestamp: new Date().toISOString(),
      },
    });

    res.status(201).json({
      result: row,
      simulatedModelImprovement: results.pipelineMeta?.simulatedModelImprovement,
    });
  } catch (e) {
    next(e);
  }
}

export async function listFeedbackForRun(req, res, next) {
  try {
    const run = await ResearchRun.findById(req.params.runId).lean();
    if (!run) {
      return res.status(404).json({ message: 'Research run not found' });
    }
    const projectRef = run.projectId || run.project;
    const access = await getProjectIfMember(projectRef, req.userId);
    if (!access) {
      return res.status(404).json({ message: 'Research run not found' });
    }

    const rows = await ExperimentalResult.find({
      $or: [{ researchRunId: req.params.runId }, { researchRun: req.params.runId }],
    })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .lean();

    const comparisons = rows.map((r) => {
      const av = r.actualValues ?? r.actual ?? {};
      const pr = r.predicted ?? {};
      return {
        id: r._id,
        candidateId: r.candidateId,
        candidateName: r.candidateName,
        predicted: pr,
        actualValues: av,
        actual: av,
        delta: {
          activityScore: (av.activityScore ?? 0) - (pr.activityScore ?? 0),
          selectivity: (av.selectivity ?? 0) - (pr.selectivity ?? 0),
          stability: (av.stability ?? 0) - (pr.stability ?? 0),
        },
        notes: r.notes,
        userId: r.userId || r.loggedBy,
        loggedBy: r.userId || r.loggedBy,
        createdAt: r.createdAt,
      };
    });

    const results = getResults(run);
    res.json({
      comparisons,
      simulatedModelImprovement: results.pipelineMeta?.simulatedModelImprovement ?? 0,
    });
  } catch (e) {
    next(e);
  }
}
