/**
 * Mock Open Catalyst Project adsorbate/slab results.
 * FUTURE: Replace with OC20/ODAC model API, fairchem, custom DFT queue.
 */

const SAMPLES = [
  {
    name: 'Pt(111) *CO hydrogenation precursor',
    structure: 'Pt(111) p(2×2) · *CO',
    activityScore: 0.91,
    selectivity: 0.76,
    stability: 0.84,
    sourceDatabase: 'Open Catalyst Project (mock)',
  },
  {
    name: 'RuO2 (110) OER intermediate',
    structure: 'RuO2 rutile · *OOH bridge',
    activityScore: 0.87,
    selectivity: 0.69,
    stability: 0.81,
    sourceDatabase: 'Open Catalyst Project (mock)',
  },
  {
    name: 'IrO2 strained (100)',
    structure: 'IrO2 · 2% biaxial strain',
    activityScore: 0.85,
    selectivity: 0.72,
    stability: 0.77,
    sourceDatabase: 'Open Catalyst Project (mock)',
  },
];

export async function fetchOpenCatalystCandidates(targetReaction, { limit = 6 } = {}) {
  void targetReaction;
  const shuffled = [...SAMPLES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(limit, shuffled.length)).map((c, i) => ({
    ...c,
    mockId: `oc-${i + 1}`,
  }));
}
