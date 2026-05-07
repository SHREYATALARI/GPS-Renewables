import AppShell from '../components/AppShell.jsx';

export default function ExperimentsPage() {
  return (
    <AppShell title="Experiments">
      <div className="space-y-4">
        <div className="rounded-xl border border-emerald-100 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-800">Experimental Queue</h2>
          <ul className="mt-2 text-xs text-slate-600 space-y-1">
            <li>Batch A12 · RuO2 Oxygen Vacancy · Planned at 523°C</li>
            <li>Batch B03 · Ni-Doped MoS2 Edge Catalyst · Planned at 498°C</li>
          </ul>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-800">Batch History</h2>
          <p className="text-xs text-slate-600 mt-1">
            12 experiment batches logged. 4 batches exceed benchmark selectivity.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
