import { useState } from 'react';
import AppShell from '../components/AppShell.jsx';
import SyntheticBiologyNav from '../components/SyntheticBiologyNav.jsx';

export default function SyntheticBiologyExperimentsPage() {
  const [rows, setRows] = useState([]);
  const [yieldValue, setYieldValue] = useState('');
  const [mutation, setMutation] = useState('');
  const [growth, setGrowth] = useState('');

  return (
    <AppShell title="Synthetic Biology · Experiments">
      <div className="space-y-4">
        <SyntheticBiologyNav />
        <div className="rounded-xl border border-emerald-100 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-800">Experimental Feedback Loop</h3>
          <div className="grid sm:grid-cols-3 gap-2 mt-2">
            <input value={yieldValue} onChange={(e) => setYieldValue(e.target.value)} placeholder="Actual yield (%)" className="rounded border border-emerald-100 px-2 py-1.5 text-sm" />
            <input value={mutation} onChange={(e) => setMutation(e.target.value)} placeholder="Mutation validation" className="rounded border border-emerald-100 px-2 py-1.5 text-sm" />
            <input value={growth} onChange={(e) => setGrowth(e.target.value)} placeholder="Observed growth rate" className="rounded border border-emerald-100 px-2 py-1.5 text-sm" />
          </div>
          <button
            className="mt-2 text-xs px-3 py-1.5 rounded bg-emerald-600 text-white"
            onClick={() => {
              setRows((prev) => [
                {
                  ts: new Date().toISOString(),
                  yieldValue,
                  mutation,
                  growth,
                  retrained: true,
                },
                ...prev,
              ]);
              setYieldValue('');
              setMutation('');
              setGrowth('');
            }}
          >
            Log experiment and retrain
          </button>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-800">Experiment timeline</h3>
          <div className="mt-2 space-y-2 text-xs">
            {rows.map((r, i) => (
              <div key={`${r.ts}-${i}`} className="rounded border border-emerald-100 p-2">
                {new Date(r.ts).toLocaleString()} · Yield {r.yieldValue}% · Mutation {r.mutation} · Growth {r.growth}
                {' '}· AI confidence updated
              </div>
            ))}
            {!rows.length && <p className="text-slate-500">No experiments logged yet.</p>}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
