import { useState } from 'react';
import AppShell from '../components/AppShell.jsx';
import SyntheticBiologyNav from '../components/SyntheticBiologyNav.jsx';

export default function SyntheticBiologyCollaborationPage() {
  const [comment, setComment] = useState('');
  const [feed, setFeed] = useState([
    { ts: new Date().toISOString(), user: 'Dr. Nair', text: 'Flux bottleneck noted at pyruvate decarboxylase.' },
  ]);

  return (
    <AppShell title="Synthetic Biology · Collaboration">
      <div className="space-y-4">
        <SyntheticBiologyNav />
        <div className="rounded-xl border border-emerald-100 bg-white p-4">
          <p className="text-xs text-slate-600">Active researchers: 6 · Shared pathway notes and experiment annotations enabled.</p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-2 w-full min-h-[90px] rounded border border-emerald-100 px-3 py-2 text-sm"
            placeholder="Add collaboration note..."
          />
          <button
            className="mt-2 text-xs px-3 py-1.5 rounded border border-emerald-200 text-emerald-700"
            onClick={() => {
              if (!comment.trim()) return;
              setFeed((prev) => [{ ts: new Date().toISOString(), user: 'You', text: comment.trim() }, ...prev]);
              setComment('');
            }}
          >
            Post note
          </button>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-800">Collaboration history</h3>
          <div className="mt-2 space-y-2 text-xs">
            {feed.map((f, i) => (
              <div key={`${f.ts}-${i}`} className="rounded border border-emerald-100 p-2">
                <p className="text-slate-700">{f.text}</p>
                <p className="text-slate-500 mt-0.5">{f.user} · {new Date(f.ts).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
