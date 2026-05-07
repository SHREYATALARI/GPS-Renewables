/**
 * Mock BRENDA-style enzyme entries.
 * FUTURE: Replace with SOAP/REST BRENDA client, EC number filters, organism namespace.
 */

const SAMPLES = [
  {
    name: 'Alcohol dehydrogenase (ADH1)',
    structure: 'PDB-style: homotetramer Zn-dependent',
    activityScore: 0.78,
    selectivity: 0.82,
    stability: 0.7,
    sourceDatabase: 'BRENDA (mock)',
  },
  {
    name: 'Laccase (EC 1.10.3.2)',
    structure: 'Cu4 cluster T1/T2/T3 oxidoreductase',
    activityScore: 0.72,
    selectivity: 0.77,
    stability: 0.75,
    sourceDatabase: 'BRENDA (mock)',
  },
  {
    name: 'Nitrile hydratase (NHase)',
    structure: 'αβ heterodimer · non-heme Fe/Co variants',
    activityScore: 0.81,
    selectivity: 0.79,
    stability: 0.66,
    sourceDatabase: 'BRENDA (mock)',
  },
];

export async function fetchBrendaCandidates(targetReaction, { limit = 6 } = {}) {
  void targetReaction;
  const shuffled = [...SAMPLES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(limit, shuffled.length)).map((c, i) => ({
    ...c,
    mockId: `br-${i + 1}`,
  }));
}
