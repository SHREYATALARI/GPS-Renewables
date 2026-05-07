import AppShell from '../components/AppShell.jsx';

export default function FeedbackLoopPage() {
  return (
    <AppShell title="Feedback Loop">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-emerald-100 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-800">Prediction vs Actual</h2>
          <p className="text-xs text-slate-600 mt-1">
            Mean absolute discrepancy: 0.072 · Calibration trend: improving over last 5 runs.
          </p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-800">Retraining Logs</h2>
          <p className="text-xs text-slate-600 mt-1">
            Latest retrain: model v1.5 with confidence uplift of 3.4%.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
