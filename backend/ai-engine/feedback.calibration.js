/**
 * Simulates model improvement from logged experimental vs predicted deltas.
 * FUTURE: Trigger retraining jobs, Bayesian updating, active learning batch selection.
 */

export function computeSimulatedImprovement(experimentalRows) {
  if (!experimentalRows.length) return 0;
  let total = 0;
  for (const row of experimentalRows) {
    const p = row.predicted || {};
    const a = row.actualValues || row.actual || {};
    const e =
      Math.abs((p.activityScore ?? 0) - (a.activityScore ?? 0)) +
      Math.abs((p.selectivity ?? 0) - (a.selectivity ?? 0)) +
      Math.abs((p.stability ?? 0) - (a.stability ?? 0));
    total += e;
  }
  const meanErr = total / experimentalRows.length;
  /** Larger error "teaches" more in this toy simulation */
  const bump = Math.min(0.15, meanErr * 0.25);
  return Number(bump.toFixed(4));
}
