import AppShell from '../components/AppShell.jsx';
import SyntheticBiologyNav from '../components/SyntheticBiologyNav.jsx';
import { synbioEnzymes } from '../data/synbioMockData.js';

export default function SyntheticBiologyProteinsPage() {
  return (
    <AppShell title="Synthetic Biology · Proteins">
      <div className="space-y-4">
        <SyntheticBiologyNav />
        <div className="grid lg:grid-cols-3 gap-4">
          {synbioEnzymes.map((e) => (
            <div key={e.id} className="rounded-xl border border-emerald-100 bg-white p-4">
              <p className="text-sm font-semibold text-slate-800">{e.name}</p>
              <p className="text-xs text-slate-600 mt-1">Mutation: {e.mutation}</p>
              <p className="text-xs text-slate-600">Stability: {e.stability}</p>
              <p className="text-xs text-slate-600">Catalytic efficiency: {e.catalyticEfficiency}</p>
              <p className="text-xs text-slate-600">Thermostability score: {e.thermostability}</p>
              <div className="mt-2 h-28 rounded-lg border border-emerald-100 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),rgba(255,255,255,0.95))] flex items-center justify-center text-[11px] text-slate-600">
                Protein ribbon / mutation highlight viewport
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
