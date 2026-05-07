import { useMemo, useState } from 'react';
import AppShell from '../components/AppShell.jsx';

const seed = [
  { name: 'RuO2 Oxygen Vacancy', activity: 0.92, selectivity: 84, stability: 78, novelty: 0.88 },
  { name: 'Pt(111) Hydrogenation Surface', activity: 0.85, selectivity: 79, stability: 74, novelty: 0.69 },
  { name: 'Pd Single-Atom MOF Catalyst', activity: 0.83, selectivity: 82, stability: 71, novelty: 0.82 },
  { name: 'Ni-Doped MoS2 Edge Catalyst', activity: 0.8, selectivity: 76, stability: 80, novelty: 0.77 },
];

export default function AICandidatesPage() {
  const [q, setQ] = useState('');
  const rows = useMemo(
    () => seed.filter((x) => x.name.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  return (
    <AppShell title="AI Candidates">
      <div className="space-y-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search candidate..."
          className="w-full max-w-sm rounded-lg border border-emerald-100 px-3 py-2 text-sm"
        />
        <div className="rounded-xl border border-emerald-100 bg-white overflow-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-emerald-50">
              <tr>
                <th className="px-3 py-2 text-left">Catalyst</th>
                <th className="px-3 py-2 text-left">Activity</th>
                <th className="px-3 py-2 text-left">Selectivity (%)</th>
                <th className="px-3 py-2 text-left">Stability (h)</th>
                <th className="px-3 py-2 text-left">Novelty</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name} className="border-t border-emerald-100">
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2">{r.activity}</td>
                  <td className="px-3 py-2">{r.selectivity}</td>
                  <td className="px-3 py-2">{r.stability}</td>
                  <td className="px-3 py-2">{r.novelty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
