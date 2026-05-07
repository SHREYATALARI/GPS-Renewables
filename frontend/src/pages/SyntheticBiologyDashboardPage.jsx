import {
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import AppShell from '../components/AppShell.jsx';
import SyntheticBiologyNav from '../components/SyntheticBiologyNav.jsx';

export default function SyntheticBiologyDashboardPage() {
  return (
    <AppShell title="GPS Renewables — Synthetic Biology AI Platform">
      <div className="space-y-5">
        <p className="text-sm text-slate-600">
          AI-assisted enzyme engineering, metabolic pathway optimization, and microbial systems design
          for sustainable fuels and biomass conversion.
        </p>
        <SyntheticBiologyNav />
        <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            ['Active pathways', 18],
            ['Engineered enzymes', 42],
            ['Predicted yield uplift', '23%'],
            ['Carbon efficiency', '81%'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-emerald-100 bg-white p-4">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-xl font-semibold text-emerald-700 mt-1">{value}</p>
            </div>
          ))}
        </section>
        <section className="grid xl:grid-cols-2 gap-5">
          <div className="rounded-xl border border-emerald-100 bg-white p-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { module: 'Enzyme engineering', score: 88 },
                  { module: 'Flux optimization', score: 82 },
                  { module: 'Mutation AI', score: 85 },
                  { module: 'Genome edits', score: 79 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#dbe7db" />
                <XAxis dataKey="module" hide />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" name="AI readiness" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-white p-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={[
                  { axis: 'Yield', value: 82 },
                  { axis: 'Stability', value: 77 },
                  { axis: 'Novelty', value: 85 },
                  { axis: 'Carbon', value: 81 },
                  { axis: 'Scalability', value: 74 },
                ]}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="axis" />
                <PolarRadiusAxis />
                <Radar dataKey="value" name="Bio AI metrics" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.28} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
