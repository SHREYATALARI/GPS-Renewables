import AppShell from '../components/AppShell.jsx';

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <div className="grid md:grid-cols-2 gap-4">
        {[
          'Theme settings',
          'AI pipeline settings',
          'Research preferences',
          'Visualization settings',
          'Notification settings',
        ].map((s) => (
          <div key={s} className="rounded-xl border border-emerald-100 bg-white p-4">
            <p className="text-sm font-semibold text-slate-800">{s}</p>
            <p className="text-xs text-slate-600 mt-1">Configured for light mode sustainable scientific UI.</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
