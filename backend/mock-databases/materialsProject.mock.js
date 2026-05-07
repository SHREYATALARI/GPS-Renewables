/**
 * Mock Materials Project–style catalyst records.
 * FUTURE: Replace with materialsproject.org REST client, API key from env, caching layer.
 */

const SAMPLES = [
  {
    name: 'Pt@Co3O4 spinel (001)',
    structure: 'Pt4/Co48/O96 · P1 (relaxed slab)',
    activityScore: 0.82,
    selectivity: 0.71,
    stability: 0.88,
    sourceDatabase: 'Materials Project (mock)',
  },
  {
    name: 'Ni-doped MoS2 edge',
    structure: 'Mo15S32Ni2 · zigzag edge cluster',
    activityScore: 0.74,
    selectivity: 0.63,
    stability: 0.79,
    sourceDatabase: 'Materials Project (mock)',
  },
  {
    name: 'Cu2O (110) oxygen vacancy',
    structure: 'Cu32O31 · vacancy supercell',
    activityScore: 0.69,
    selectivity: 0.58,
    stability: 0.72,
    sourceDatabase: 'Materials Project (mock)',
  },
];

export async function fetchMaterialsProjectCandidates(targetReaction, { limit = 6 } = {}) {
  void targetReaction;
  const shuffled = [...SAMPLES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(limit, shuffled.length)).map((c, i) => ({
    ...c,
    mockId: `mp-${i + 1}`,
  }));
}
