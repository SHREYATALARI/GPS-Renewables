/**
 * Aggregator for all external (mock) scientific databases.
 * FUTURE: Register new adapters in a plugin map; circuit breakers; request batching.
 */
import { fetchMaterialsProjectCandidates } from './materialsProject.mock.js';
import { fetchOpenCatalystCandidates } from './openCatalyst.mock.js';
import { fetchBrendaCandidates } from './brenda.mock.js';

export async function retrieveAllKnownCatalysts(targetReaction) {
  const [mp, oc, br] = await Promise.all([
    fetchMaterialsProjectCandidates(targetReaction, { limit: 4 }),
    fetchOpenCatalystCandidates(targetReaction, { limit: 4 }),
    fetchBrendaCandidates(targetReaction, { limit: 4 }),
  ]);

  const merged = [...mp, ...oc, ...br].map((raw, idx) => ({
    id: raw.mockId || `db-${idx + 1}`,
    name: raw.name,
    structure: raw.structure,
    activityScore: raw.activityScore,
    selectivity: raw.selectivity,
    stability: raw.stability,
    sourceDatabase: raw.sourceDatabase,
    kind: 'retrieved',
  }));

  merged.sort((a, b) => b.activityScore - a.activityScore);
  return merged;
}

export const MOCK_DATABASE_IDS = ['materials_project', 'open_catalyst', 'brenda'];
