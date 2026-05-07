import AppShell from '../components/AppShell.jsx';

export default function ExportCenterPage() {
  return (
    <AppShell title="Export Center">
      <div className="rounded-xl border border-emerald-100 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-800">Export Dashboard</h2>
        <div className="mt-3 grid sm:grid-cols-3 gap-2">
          <button className="export-btn">Download JSON</button>
          <button className="export-btn">Download CSV</button>
          <button className="export-btn">Download PDF Report</button>
        </div>
        <p className="text-xs text-slate-600 mt-3">
          Report preview includes catalyst metrics, stability trends, and energy pathway interpretation.
        </p>
      </div>
    </AppShell>
  );
}
