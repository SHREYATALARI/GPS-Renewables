/**
 * Mock property predictor: refines scores with deterministic noise.
 * FUTURE: ONNX/TorchServe models, ensembles, calibrated uncertainty intervals, conformal prediction.
 */

function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function pseudoNoise(id, salt) {
  const n = hashString(`${id}:${salt}`) % 1000;
  return (n / 1000 - 0.5) * 0.08;
}

export async function predictProperties(candidates, context) {
  const { targetReaction = '', modelVersion = 'mock-v1' } = context || {};
  void targetReaction;

  return candidates.map((c, index) => {
    const activityScore = Math.min(
      0.99,
      Math.max(0.01, c.activityScore + pseudoNoise(c.id, 'a') + index * 0.001)
    );
    const selectivity = Math.min(
      0.99,
      Math.max(0.01, c.selectivity + pseudoNoise(c.id, 's'))
    );
    const stability = Math.min(0.99, Math.max(0.01, c.stability + pseudoNoise(c.id, 't')));

    return {
      ...c,
      activityScore: Number(activityScore.toFixed(3)),
      selectivity: Number(selectivity.toFixed(3)),
      stability: Number(stability.toFixed(3)),
      sourceDatabase: c.sourceDatabase,
      kind: c.kind,
      rank: index + 1,
      modelVersion,
    };
  });
}
