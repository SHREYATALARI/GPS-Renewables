/**
 * One-time idempotent migrations for renamed / nested fields.
 * Safe under concurrent multi-user loads: only adds/normalizes fields; no shared in-memory state.
 * FUTURE: Replace with explicit migration tool (migrate-mongo) + versioning table.
 */
import Project from '../models/Project.model.js';
import ResearchRun from '../models/ResearchRun.model.js';
import Feedback from '../models/ExperimentalResult.model.js';

export async function migrateLegacySchemas() {
  try {
    const p1 = await Project.collection.updateMany(
      { ownerId: { $exists: false }, owner: { $exists: true } },
      [{ $set: { ownerId: '$owner' } }]
    );
    if (p1.modifiedCount) console.log(`[migrate] Project owner→ownerId: ${p1.modifiedCount}`);

    const withLegacyCollab = await Project.find({
      'collaborators.0.user': { $exists: true },
    }).lean();

    for (const doc of withLegacyCollab) {
      const ids = (doc.collaborators || [])
        .map((c) => (c.user ? c.user : c))
        .filter(Boolean);
      await Project.collection.updateOne({ _id: doc._id }, { $set: { collaborators: ids } });
    }

    const r1 = await ResearchRun.collection.updateMany(
      { userId: { $exists: false }, createdBy: { $exists: true } },
      [{ $set: { userId: '$createdBy' } }]
    );
    if (r1.modifiedCount) console.log(`[migrate] ResearchRun createdBy→userId: ${r1.modifiedCount}`);

    const r2 = await ResearchRun.collection.updateMany(
      { projectId: { $exists: false }, project: { $exists: true } },
      [{ $set: { projectId: '$project' } }]
    );
    if (r2.modifiedCount) console.log(`[migrate] ResearchRun project→projectId: ${r2.modifiedCount}`);

    const r3 = await ResearchRun.collection.updateMany(
      { reactionInput: { $exists: false }, targetReaction: { $exists: true } },
      [{ $set: { reactionInput: '$targetReaction' } }]
    );
    if (r3.modifiedCount) console.log(`[migrate] ResearchRun targetReaction→reactionInput: ${r3.modifiedCount}`);

    const runsNeedResults = await ResearchRun.find({
      results: { $exists: false },
      predictions: { $exists: true },
    }).lean();

    for (const r of runsNeedResults) {
      await ResearchRun.collection.updateOne(
        { _id: r._id },
        {
          $set: {
            results: {
              retrievedCandidates: r.retrievedCandidates || [],
              generatedCandidates: r.generatedCandidates || [],
              predictions: r.predictions || [],
              pipelineMeta: r.pipelineMeta || {},
            },
          },
        }
      );
    }
    if (runsNeedResults.length) {
      console.log(`[migrate] ResearchRun nested results: ${runsNeedResults.length}`);
    }

    const f1 = await Feedback.collection.updateMany(
      { userId: { $exists: false }, loggedBy: { $exists: true } },
      [{ $set: { userId: '$loggedBy' } }]
    );
    if (f1.modifiedCount) console.log(`[migrate] Feedback loggedBy→userId: ${f1.modifiedCount}`);

    const f2 = await Feedback.collection.updateMany(
      { projectId: { $exists: false }, project: { $exists: true } },
      [{ $set: { projectId: '$project' } }]
    );
    if (f2.modifiedCount) console.log(`[migrate] Feedback project→projectId: ${f2.modifiedCount}`);

    const f3 = await Feedback.collection.updateMany(
      { researchRunId: { $exists: false }, researchRun: { $exists: true } },
      [{ $set: { researchRunId: '$researchRun' } }]
    );
    if (f3.modifiedCount) console.log(`[migrate] Feedback researchRun→researchRunId: ${f3.modifiedCount}`);

    const f4 = await Feedback.collection.updateMany(
      { actualValues: { $exists: false }, actual: { $exists: true } },
      [{ $set: { actualValues: '$actual' } }]
    );
    if (f4.modifiedCount) console.log(`[migrate] Feedback actual→actualValues: ${f4.modifiedCount}`);
  } catch (e) {
    console.error('[migrate] legacy schema migration failed:', e);
    throw e;
  }
}
