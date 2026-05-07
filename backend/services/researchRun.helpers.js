/**
 * Normalize ResearchRun payloads across legacy flat vs nested `results` shapes.
 * Pure functions — safe under concurrent requests.
 */

export function getResults(run) {
  if (!run) return {};
  const o = run?.toObject ? run.toObject({ minimize: false }) : run;

  if (o.results && typeof o.results === 'object') {
    const r = o.results;
    return {
      retrievedCandidates: r.retrievedCandidates ?? [],
      generatedCandidates: r.generatedCandidates ?? [],
      predictions: r.predictions ?? [],
      pipelineMeta: r.pipelineMeta ?? {},
    };
  }

  return {
    retrievedCandidates: o.retrievedCandidates ?? [],
    generatedCandidates: o.generatedCandidates ?? [],
    predictions: o.predictions ?? [],
    pipelineMeta: o.pipelineMeta ?? {},
  };
}

export function getPredictions(run) {
  return getResults(run).predictions || [];
}
