import AppShell from '../components/AppShell.jsx';

export default function CollaborationPage() {
  return (
    <AppShell title="Collaboration">
      <div className="space-y-4">
        <div className="rounded-xl border border-emerald-100 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-800">Active Researchers</h2>
          <p className="text-xs text-slate-600 mt-1">4 researchers online in shared workspace.</p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-800">Research Notes</h2>
          <p className="text-xs text-slate-600 mt-1">
            @researcher Surface oxygen vacancies correlate with higher methanol selectivity.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
