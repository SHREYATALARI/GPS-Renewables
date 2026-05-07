/**
 * Orchestrates: DB retrieval → generation → prediction → ranking.
 * All state is passed as arguments / return values — no module-level mutable pipeline state,
 * so concurrent HTTP requests cannot overwrite each other's runs.
 *
 * FUTURE: Step functions, DAG plugins, human-in-the-loop gates, external simulators.
 */
import { retrieveAllKnownCatalysts, MOCK_DATABASE_IDS } from '../mock-databases/index.js';
import { generateCandidateDesigns } from './generative.module.js';
import { predictProperties } from './prediction.engine.js';

const MODEL_VERSION = 'mock-pipeline-1.0.0';

function rankCandidates(list) {
  const sorted = [...list].sort((a, b) => {
    const score = (x) => 0.5 * x.activityScore + 0.3 * x.selectivity + 0.2 * x.stability;
    return score(b) - score(a);
  });
  return sorted.map((c, i) => ({ ...c, rank: i + 1 }));
}

export async function runResearchPipeline({ targetReaction, generativeCount = 5 }) {
  const retrieved = await retrieveAllKnownCatalysts(targetReaction);
  const generated = await generateCandidateDesigns(retrieved, targetReaction, {
    count: generativeCount,
  });

  const combined = [...retrieved, ...generated];
  const predicted = await predictProperties(combined, {
    targetReaction,
    modelVersion: MODEL_VERSION,
  });
  const ranked = rankCandidates(predicted);

  return {
    retrievedCandidates: retrieved.map((c, i) => ({ ...c, rank: i + 1 })),
    generatedCandidates: generated,
    predictions: ranked,
    pipelineMeta: {
      modelVersion: MODEL_VERSION,
      databasesUsed: MOCK_DATABASE_IDS,
      simulatedModelImprovement: 0,
    },
  };
}
