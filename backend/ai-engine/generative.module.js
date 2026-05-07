/**
 * Placeholder generative AI: proposes hybrid catalyst/enzyme-inspired candidates from seeds.
 * FUTURE: Swap with diffusion/graph transformers, conditioning on reaction SMARTS, safety filters.
 */

function jitter(base, amplitude = 0.06) {
  const v = base + (Math.random() * 2 - 1) * amplitude;
  return Math.min(0.98, Math.max(0.05, Number(v.toFixed(3))));
}

export async function generateCandidateDesigns(seedCandidates, targetReaction, { count = 5 } = {}) {
  void targetReaction;
  const tops = [...seedCandidates]
    .filter((c) => c.kind === 'retrieved')
    .sort((a, b) => b.activityScore - a.activityScore)
    .slice(0, 3);

  const seeds = tops.length ? tops : seedCandidates.slice(0, 3);
  const out = [];

  for (let i = 0; i < count; i++) {
    const s = seeds[i % seeds.length];
    const variant = ['nano-confined', 'strained interface', 'dual-site', 'enzyme-mineral hybrid'][i % 4];
    out.push({
      id: `gen-${Date.now()}-${i}`,
      name: `Designed ${variant}: ${s.name}`,
      structure: `${s.structure} · Δ (${variant})`,
      activityScore: jitter(s.activityScore, 0.08),
      selectivity: jitter(s.selectivity, 0.07),
      stability: jitter(s.stability, 0.07),
      sourceDatabase: 'Generative module (mock)',
      kind: 'generated',
    });
  }

  return out;
}
