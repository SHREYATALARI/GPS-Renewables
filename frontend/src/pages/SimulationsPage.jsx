import AppShell from '../components/AppShell.jsx';

export default function SimulationsPage() {
  return (
    <AppShell title="Simulations">
      <div className="grid md:grid-cols-2 gap-4">
        {[
          'Reaction Simulation',
          'Stability Simulation',
          'Surface Interaction',
          'Energy Pathway',
        ].map((x) => (
          <div key={x} className="rounded-xl border border-emerald-100 bg-white p-4">
            <p className="text-sm font-semibold text-slate-800">{x}</p>
            <p className="text-xs text-slate-600 mt-1">
              AI simulation status: completed with synthetic industrial operating conditions.
            </p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
