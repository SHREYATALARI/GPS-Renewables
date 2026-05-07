import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import AppShell from '../components/AppShell.jsx';

const stageData = [
  { stage: 'Retrieval', completion: 96, latency: 1.2 },
  { stage: 'AI Generation', completion: 91, latency: 1.9 },
  { stage: 'Scoring', completion: 94, latency: 1.4 },
  { stage: 'Ranking', completion: 98, latency: 0.9 },
  { stage: 'Export', completion: 99, latency: 0.6 },
];

export default function DiscoveryPipelinePage() {
  return (
    <AppShell title="Discovery Pipeline">
      <div className="space-y-5">
        <div className="rounded-xl border border-emerald-100 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-2">Pipeline Flow</h2>
          <p className="text-xs text-slate-600">
            Database retrieval → AI candidate generation → ranking engine → export center.
          </p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white p-4 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dbe7db" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completion" name="Completion (%)" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="latency" name="Latency (s)" stroke="#06b6d4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppShell>
  );
}
