export function LoadingState({ label = 'Loading scientific module...' }) {
  return (
    <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 text-xs text-emerald-700">
      {label}
    </div>
  );
}

export function EmptyState({ label = 'No scientific data available.' }) {
  return (
    <div className="rounded-xl border border-emerald-100 bg-white p-3 text-xs text-slate-600">
      {label}
    </div>
  );
}
