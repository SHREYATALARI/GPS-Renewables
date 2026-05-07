#!/usr/bin/env node
/**
 * Two-user concurrent pipeline smoke test (requires running API + MongoDB).
 * Usage from backend folder:
 *   node scripts/concurrency-smoke.mjs
 * Env:
 *   API_URL (default http://localhost:5000/api)
 *
 * Creates two users, two projects, runs POST /research/run in parallel; asserts distinct run ids.
 */
const API = process.env.API_URL || 'http://localhost:5000/api';

async function register(email, password, name) {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`register ${email}: ${res.status} ${t}`);
  }
  return res.json();
}

async function runPipeline(token, projectId, label) {
  const res = await fetch(`${API}/research/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      projectId,
      targetReaction: `${label}: CO2 + H2 -> CH3OH (concurrent test)`,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`run ${label}: ${res.status} ${t}`);
  }
  return res.json();
}

async function createProject(token, name) {
  const res = await fetch(`${API}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, description: 'concurrency smoke' }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`project: ${res.status} ${t}`);
  }
  const data = await res.json();
  return data.project.id;
}

async function main() {
  const suffix = Date.now();
  const u1 = await register(`u1_${suffix}@test.local`, 'password123', 'User One');
  const u2 = await register(`u2_${suffix}@test.local`, 'password123', 'User Two');

  const p1 = await createProject(u1.token, `Proj A ${suffix}`);
  const p2 = await createProject(u2.token, `Proj B ${suffix}`);

  const [r1, r2] = await Promise.all([
    runPipeline(u1.token, p1, 'A'),
    runPipeline(u2.token, p2, 'B'),
  ]);

  const id1 = r1.run.id;
  const id2 = r2.run.id;
  if (!id1 || !id2 || id1 === id2) {
    console.error('FAIL: expected distinct run ids', { id1, id2 });
    process.exit(1);
  }
  console.log('OK: concurrent runs isolated', { id1, id2 });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
