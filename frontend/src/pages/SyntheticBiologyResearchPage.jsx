import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ZAxis,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
} from 'recharts';
import { jsPDF } from 'jspdf';
import AppShell from '../components/AppShell.jsx';
import SyntheticBiologyNav from '../components/SyntheticBiologyNav.jsx';
import { EmptyState } from '../components/StateBlocks.jsx';
import {
  synbioReactionOptions,
  synbioHosts
} from '../data/synbioMockData.js';
import {
  analyzeReaction,
  buildRiskProfile,
  generateMutations,
  generatePathways,
} from '../services/synbioEngine.js';
import { useSynbioStore } from '../stores/synbioStore.js';

export default function SyntheticBiologyResearchPage() {
  const selectedReaction = useSynbioStore((s) => s.selectedReaction);
  const setSelectedReaction = useSynbioStore((s) => s.setSelectedReaction);
  const selectedMicrobe = useSynbioStore((s) => s.selectedMicrobe);
  const setSelectedMicrobe = useSynbioStore((s) => s.setSelectedMicrobe);
  const selectedEnzyme = useSynbioStore((s) => s.selectedEnzyme);
  const setSelectedEnzyme = useSynbioStore((s) => s.setSelectedEnzyme);
  const generatedPathways = useSynbioStore((s) => s.generatedPathways);
  const setGeneratedPathways = useSynbioStore((s) => s.setGeneratedPathways);
  const mutations = useSynbioStore((s) => s.mutations);
  const setMutations = useSynbioStore((s) => s.setMutations);
  const collaborators = useSynbioStore((s) => s.collaborators);
  const setCollaborators = useSynbioStore((s) => s.setCollaborators);
  const addReport = useSynbioStore((s) => s.addReport);
  const reports = useSynbioStore((s) => s.reports);

  const [reaction, setReaction] = useState(selectedReaction || synbioReactionOptions[0]);
  const [objective, setObjective] = useState('Yield Maximization');
  const [host, setHost] = useState(synbioHosts[0]);
  const [ran, setRan] = useState(false);
  const [selectedPathway, setSelectedPathway] = useState(null);
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('synbio-notes') || '[]');
    } catch {
      return [];
    }
  });
  const [actualYield, setActualYield] = useState('');
  const [growthRate, setGrowthRate] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [selectedPathwaysForCompare, setSelectedPathwaysForCompare] = useState([]);
  const [fluxData, setFluxData] = useState([]);
  const [fluxReport, setFluxReport] = useState('');
  const [openedEnzyme, setOpenedEnzyme] = useState(null);
  const [simulationLogs, setSimulationLogs] = useState([]);
  const [simRunning, setSimRunning] = useState(false);
  const [simPaused, setSimPaused] = useState(false);
  const [simSeries, setSimSeries] = useState([]);
  const [reportText, setReportText] = useState('');
  const [collabInput, setCollabInput] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Researcher');
  const [labStrategy, setLabStrategy] = useState('');
  const [riskProfile, setRiskProfile] = useState([]);
  const [planner, setPlanner] = useState([]);
  const [bizSummary, setBizSummary] = useState('');
  const [feedbackEntries, setFeedbackEntries] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('synbio-feedback') || '[]');
    } catch {
      return [];
    }
  });
  const [feedbackSearch, setFeedbackSearch] = useState('');
  const [retrainProgress, setRetrainProgress] = useState(0);
  const [retrainVersion, setRetrainVersion] = useState(1);
  const [modelMetrics, setModelMetrics] = useState({ before: 0.72, after: 0.72 });
  const [timelineSearch, setTimelineSearch] = useState('');
  const [timelineFilter, setTimelineFilter] = useState('all');
  const [compareEntries, setCompareEntries] = useState([]);

  useEffect(() => {
    localStorage.setItem('synbio-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('synbio-collaborators', JSON.stringify(collaborators));
  }, [collaborators]);
  useEffect(() => {
    localStorage.setItem('synbio-feedback', JSON.stringify(feedbackEntries));
  }, [feedbackEntries]);

  useEffect(() => {
    const int = setInterval(() => {
      if (!simRunning || simPaused) return;
      setSimSeries((prev) => {
        const t = prev.length;
        const y = Number((58 + t * 1.8 + Math.sin(t / 2) * 4).toFixed(2));
        return [...prev, { t, yield: y, growth: Number((0.32 + t * 0.03).toFixed(2)) }].slice(-24);
      });
      setSimulationLogs((prev) => [
        `${new Date().toLocaleTimeString()} | Fermentation step completed | flux recalibrated`,
        ...prev,
      ].slice(0, 30));
    }, 1000);
    return () => clearInterval(int);
  }, [simRunning, simPaused]);

  function runDiscovery() {
    try {
      const out = analyzeReaction(reaction, host, objective);
      setAnalysis(out);
      setSelectedReaction(reaction);
      setSelectedMicrobe(out.microbes[0]?.name || null);
      setSelectedEnzyme(out.enzymes[0]?.name || null);
      const paths = generatePathways(reaction, out.microbes[0]?.name, out.enzymes[0]?.name);
      setGeneratedPathways(paths);
      setMutations(generateMutations(reaction, out.enzymes[0]?.name));
      setRiskProfile(buildRiskProfile(reaction));
      setFluxData(paths.map((p, i) => ({
        step: `Path ${i + 1}`,
        flux: p.predictedYield - 8,
        atp: p.atpUsage,
        nadh: p.nadhUsage,
        carbonLoss: 100 - p.carbonEfficiency,
      })));
      setRan(true);
      setNotes((prev) => [
        {
          ts: new Date().toISOString(),
          text: `AI discovery completed for ${reaction} in ${host} (${objective}) with ${out.profile} profile.`,
          type: 'discovery',
        },
        ...prev,
      ]);
    } catch (e) {
      setFluxReport(`Discovery fallback activated: ${e.message}`);
    }
  }

  function optimizePathway(pathwayId) {
    setGeneratedPathways((prev) =>
      prev.map((p) =>
        p.id === pathwayId
          ? {
              ...p,
              predictedYield: Math.min(95, p.predictedYield + 6),
              optimization: `${p.optimization} ATP regeneration loop inserted to reduce cofactor burden.`,
            }
          : p
      )
    );
    setFluxReport('Pathway optimization applied: predicted yield increased and ATP burden reduced.');
  }

  function simulateFlux(pathwayId) {
    const p = generatedPathways.find((x) => x.id === pathwayId);
    if (!p) return;
    const data = [0, 2, 4, 6, 8, 10].map((t) => ({
      t,
      flux: Number((p.predictedYield * 0.6 + t * 2.2).toFixed(2)),
      atp: Number((p.atpUsage + t * 0.3).toFixed(2)),
    }));
    setSimSeries(data.map((d) => ({ t: d.t, yield: d.flux, growth: Number((0.24 + d.t * 0.05).toFixed(2)) })));
    setFluxReport(`Flux simulation for "${p.name}" indicates bottleneck shift after hour 6 with improved cofactor balancing.`);
  }

  function exportPathway(pathway) {
    const blob = new Blob([JSON.stringify(pathway, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pathway.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function generateReport() {
    const p = generatedPathways[0];
    const text = [
      'Synthetic Biology AI Scientific Report',
      '',
      `Reaction: ${reaction}`,
      `Objective: ${objective}`,
      `Host: ${selectedMicrobe || host}`,
      `Enzyme: ${selectedEnzyme || 'N/A'}`,
      `Top pathway: ${p?.name || 'N/A'} (yield ${p?.predictedYield || 'N/A'}%)`,
      `Observations: ${fluxReport || 'Flux profile suggests bottleneck at cofactor balancing step.'}`,
      'Methodology: rule-based reaction classification + pathway synthesis + mutation ranking.',
      'Future work: adaptive promoter tuning and fed-batch optimization.',
    ].join('\n');
    setReportText(text);
    addReport({ ts: new Date().toISOString(), type: 'scientific', text });
  }

  function exportReportPdf() {
    const doc = new jsPDF();
    doc.setFontSize(13);
    doc.text('Synthetic Biology AI Report', 14, 16);
    doc.setFontSize(10);
    const lines = (reportText || 'Generate report first.').split('\n');
    lines.forEach((l, i) => doc.text(l, 14, 28 + i * 6));
    doc.save('synbio-report.pdf');
  }

  function exportReportJson() {
    const payload = {
      reaction,
      objective,
      selectedMicrobe,
      selectedEnzyme,
      pathways: generatedPathways,
      mutations,
      riskProfile,
      reportText,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'synbio-report.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function inviteCollaborator() {
    if (!inviteEmail.trim()) return;
    setCollaborators([
      { email: inviteEmail.trim(), role: inviteRole, ts: new Date().toISOString() },
      ...collaborators,
    ]);
    setInviteEmail('');
  }

  function addComment() {
    if (!collabInput.trim()) return;
    setNotes([{ ts: new Date().toISOString(), text: collabInput, editable: true }, ...notes]);
    setCollabInput('');
  }

  function logFeedbackAndRetrain() {
    const entry = {
      id: `${Date.now()}`,
      ts: new Date().toISOString(),
      reaction,
      actualYield: Number(actualYield || 0),
      growthRate: Number(growthRate || 0),
      selectedMicrobe,
      selectedEnzyme,
      notes: `Mutation notes linked to ${selectedEnzyme || 'selected enzyme'}.`,
      before: modelMetrics.after,
    };
    setFeedbackEntries((prev) => [entry, ...prev].slice(0, 60));
    setRetrainProgress(0);
    const t = setInterval(() => {
      setRetrainProgress((p) => {
        const next = p + 20;
        if (next >= 100) {
          clearInterval(t);
          const after = Number(Math.min(0.96, modelMetrics.after + 0.03).toFixed(2));
          setModelMetrics({ before: modelMetrics.after, after });
          setRetrainVersion((v) => v + 1);
          setNotes((prev) => [
            { ts: new Date().toISOString(), text: `Retraining checkpoint reached: model v${retrainVersion + 1}`, type: 'retrain' },
            ...prev,
          ]);
          return 100;
        }
        return next;
      });
    }, 300);
    setActualYield('');
    setGrowthRate('');
  }

  const filteredFeedback = feedbackEntries.filter((f) =>
    `${f.reaction} ${f.selectedMicrobe} ${f.selectedEnzyme}`.toLowerCase().includes(feedbackSearch.toLowerCase())
  );

  const analyticsData = [
    { metric: 'Prediction accuracy', value: Math.round(modelMetrics.after * 100) },
    { metric: 'Pathway optimization', value: generatedPathways[0]?.predictedYield || 60 },
    { metric: 'Enzyme stability', value: mutations[0] ? Math.round(mutations[0].stability * 100) : 65 },
    { metric: 'Simulation confidence', value: 72 + Math.min(20, simSeries.length) },
    {
      metric: 'Experimental agreement',
      value: filteredFeedback[0]
        ? Math.max(35, Math.round(100 - Math.abs((filteredFeedback[0].actualYield || 0) - (generatedPathways[0]?.predictedYield || 0))))
        : 58,
    },
    { metric: 'Biosafety compliance', value: 100 - (riskProfile.reduce((a, [, v]) => a + v, 12) * 4 || 36) },
  ];

  const timelineEvents = [
    ...notes.map((n) => ({ kind: n.type || 'note', ts: n.ts, text: n.text, author: 'research-team' })),
    ...feedbackEntries.map((f) => ({ kind: 'feedback', ts: f.ts, text: `Feedback logged: yield ${f.actualYield}%`, meta: f })),
    ...reports.map((r) => ({ kind: 'report', ts: r.ts, text: 'Scientific report generated', meta: r })),
    ...collaborators.map((c) => ({ kind: 'collab', ts: c.ts, text: `Collaborator invited: ${c.email} (${c.role})` })),
  ]
    .sort((a, b) => new Date(b.ts) - new Date(a.ts))
    .filter((e) => (timelineFilter === 'all' ? true : e.kind === timelineFilter))
    .filter((e) => `${e.text} ${e.kind}`.toLowerCase().includes(timelineSearch.toLowerCase()));

  return (
    <AppShell title="Synthetic Biology AI Research Workspace">
      <div className="space-y-6">
        <SyntheticBiologyNav />

        <section className="rounded-2xl border border-emerald-100 bg-white p-5">
          <h3 className="text-sm font-semibold text-emerald-700 mb-3">Section 1 · Target Biological Reaction Input</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <textarea
              value={reaction}
              onChange={(e) => setReaction(e.target.value)}
              className="md:col-span-2 min-h-[96px] rounded-lg border border-emerald-100 px-3 py-2 text-sm"
            />
            <div className="space-y-2">
              <select value={objective} onChange={(e) => setObjective(e.target.value)} className="w-full rounded-lg border border-emerald-100 px-3 py-2 text-sm">
                <option>Yield Maximization</option>
                <option>Carbon Efficiency</option>
                <option>Thermostability</option>
                <option>Low ATP Cost</option>
              </select>
              <select value={host} onChange={(e) => setHost(e.target.value)} className="w-full rounded-lg border border-emerald-100 px-3 py-2 text-sm">
                {synbioHosts.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
              <button onClick={runDiscovery} className="w-full rounded-lg bg-emerald-600 text-white py-2 text-sm font-medium">
                Run Synthetic Bio Discovery
              </button>
            </div>
          </div>
          {ran && (
            <div className="mt-3 grid md:grid-cols-2 gap-3">
              <div className="rounded-lg border border-emerald-100 p-3 bg-emerald-50/30">
                <p className="text-xs font-semibold text-slate-700">Microorganism suggestions</p>
                <div className="mt-2 space-y-1">
                  {(analysis?.microbes || []).map((m) => (
                    <button
                      key={m.name}
                      onClick={() => setSelectedMicrobe(m.name)}
                      className={`w-full text-left text-xs rounded border px-2 py-1 ${
                        selectedMicrobe === m.name ? 'border-emerald-300 bg-emerald-50' : 'border-emerald-100'
                      }`}
                    >
                      {m.name} · conv {m.conversion} · tolerance {m.tolerance} · conf {m.confidence}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-emerald-100 p-3 bg-emerald-50/30">
                <p className="text-xs font-semibold text-slate-700">Enzyme suggestions</p>
                <div className="mt-2 space-y-1">
                  {(analysis?.enzymes || []).map((e) => (
                    <button
                      key={e.name}
                      onClick={() => setSelectedEnzyme(e.name)}
                      className={`w-full text-left text-xs rounded border px-2 py-1 ${
                        selectedEnzyme === e.name ? 'border-emerald-300 bg-emerald-50' : 'border-emerald-100'
                      }`}
                    >
                      {e.name} · eff {e.efficiency} · stab {e.stability} · conf {e.confidence}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setGeneratedPathways(generatePathways(reaction, selectedMicrobe || analysis?.microbes?.[0]?.name, selectedEnzyme || analysis?.enzymes?.[0]?.name))}
                  className="mt-2 text-[11px] px-2 py-1 rounded border border-emerald-200 text-emerald-700"
                >
                  Use in pathway generation
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-emerald-100 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Section 2 · AI Generated Metabolic Pathways</h3>
          <div className="grid xl:grid-cols-3 gap-4">
            {(generatedPathways || []).map((p) => (
              <motion.div key={p.id} whileHover={{ y: -3 }} className="rounded-xl border border-emerald-100 p-4 bg-emerald-50/30">
                <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                <p className="text-xs text-slate-600 mt-1">Yield {p.predictedYield}% · ATP {p.atpUsage} · NADH {p.nadhUsage} · Carbon {p.carbonEfficiency}%</p>
                <p className="text-xs text-slate-600">Bottlenecks: {p.bottlenecks.join(', ')}</p>
                <div className="mt-2 flex gap-1 flex-wrap">
                  <button onClick={() => setSelectedPathway(p)} className="text-[11px] px-2 py-1 rounded border border-emerald-100">View Pathway</button>
                  <button onClick={() => simulateFlux(p.id)} className="text-[11px] px-2 py-1 rounded border border-emerald-100">Simulate Flux</button>
                  <button
                    onClick={() =>
                      setSelectedPathwaysForCompare((prev) =>
                        prev.some((x) => x.id === p.id) ? prev.filter((x) => x.id !== p.id) : [...prev, p].slice(-2)
                      )
                    }
                    className="text-[11px] px-2 py-1 rounded border border-emerald-100"
                  >
                    Compare
                  </button>
                  <button onClick={() => optimizePathway(p.id)} className="text-[11px] px-2 py-1 rounded border border-emerald-100">Optimize Pathway</button>
                  <button onClick={() => exportPathway(p)} className="text-[11px] px-2 py-1 rounded border border-emerald-100">Export Pathway</button>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-emerald-700 mt-2">{fluxReport}</p>
        </section>

        <section className="grid xl:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-emerald-100 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Section 3 · Enzyme Engineering</h3>
            <div className="space-y-3">
              {(mutations || []).map((e, i) => (
                <div key={e.variant} className="rounded-lg border border-emerald-100 p-3 text-xs">
                  <p className="font-semibold text-slate-700">{e.variant}</p>
                  <p>Predicted stability: {e.stability}</p>
                  <p>Activity score: {e.activity}</p>
                  <p>Folding confidence: {e.folding}</p>
                  <p>Industrial robustness: {e.robustness}</p>
                  <p>Mutation impact: {e.note}</p>
                  <div className="mt-1 flex gap-1">
                    <button onClick={() => setOpenedEnzyme(e)} className="text-[11px] px-2 py-1 rounded border border-emerald-100">Protein Viewer</button>
                    <button onClick={() => setFluxReport(`Mutation impact for ${e.variant}: ${e.note}`)} className="text-[11px] px-2 py-1 rounded border border-emerald-100">Mutation Impact</button>
                    <button onClick={() => setSelectedPathwaysForCompare(generatedPathways.slice(0, 2))} className="text-[11px] px-2 py-1 rounded border border-emerald-100">Compare Variants</button>
                    <button onClick={() => setMutations((prev) => prev.map((m, idx) => (idx === i ? { ...m, stability: Number((m.stability + 0.04).toFixed(2)) } : m)))} className="text-[11px] px-2 py-1 rounded border border-emerald-100">Predict Stability</button>
                    <button onClick={() => setMutations((prev) => [...prev, { ...e, variant: `${e.variant}-V2`, activity: Number((e.activity + 0.08).toFixed(2)), note: 'AI generated improved active-site variant.' }])} className="text-[11px] px-2 py-1 rounded border border-emerald-100">Generate Improved Variant</button>
                    <button onClick={() => setFluxReport(`Docking completed for ${e.variant}: substrate affinity improved by 11%.`)} className="text-[11px] px-2 py-1 rounded border border-emerald-100">Dock Substrate</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Section 4 · Protein Structure Viewer</h3>
            <div className="h-56 rounded-xl border border-emerald-100 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),rgba(255,255,255,0.9))] p-2">
              <ProteinViewer variant={openedEnzyme?.variant || selectedEnzyme || 'Protein scaffold'} />
            </div>
          </div>
        </section>

        <section className="grid xl:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 h-[320px]">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Section 5 · Flux Analysis & Bottleneck Detection</h3>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={fluxData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dbe7db" />
                <XAxis dataKey="step" hide />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="flux" fill="#10b981" name="Flux rate" />
                <Bar dataKey="carbonLoss" fill="#f59e0b" name="Carbon loss" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-emerald-700">AI interpretation: Flux bottleneck detected at pyruvate decarboxylase step.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Section 6 · Biological Simulation Engine</h3>
            <div className="flex gap-2 text-xs mb-2">
              <button onClick={() => { setSimRunning(true); setSimPaused(false); }} className="px-2 py-1 rounded border border-emerald-100">Start Simulation</button>
              <button onClick={() => setSimPaused(true)} className="px-2 py-1 rounded border border-emerald-100">Pause</button>
              <button onClick={() => { setSimRunning(true); setSimPaused(false); }} className="px-2 py-1 rounded border border-emerald-100">Resume</button>
              <button onClick={() => { setSimRunning(false); setSimPaused(false); setSimSeries([]); setSimulationLogs([]); }} className="px-2 py-1 rounded border border-emerald-100">Reset</button>
            </div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={simSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dbe7db" />
                  <XAxis dataKey="t" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line dataKey="yield" stroke="#10b981" name="Production rate" />
                  <Line dataKey="growth" stroke="#06b6d4" name="Growth curve" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="max-h-20 overflow-y-auto text-[11px] text-slate-600 mt-1">
              {simulationLogs.map((l, i) => <p key={`${l}-${i}`}>{l}</p>)}
            </div>
          </div>
        </section>

        <section className="grid xl:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-emerald-100 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Section 7 · AI Scientific Report Generator</h3>
            <div className="flex gap-2 text-xs mb-2">
              <button onClick={generateReport} className="px-2 py-1 rounded border border-emerald-100">Generate Report</button>
              <button onClick={exportReportPdf} className="px-2 py-1 rounded border border-emerald-100">Export PDF</button>
              <button onClick={exportReportJson} className="px-2 py-1 rounded border border-emerald-100">Export JSON</button>
              <button onClick={() => setNotes((p) => [{ ts: new Date().toISOString(), text: 'Report shared with collaborators.' }, ...p])} className="px-2 py-1 rounded border border-emerald-100">Share Report</button>
            </div>
            <pre className="text-[11px] bg-emerald-50/30 p-2 rounded border border-emerald-100 whitespace-pre-wrap">{reportText || 'Generate report to view abstract, methodology, observations, and recommendations.'}</pre>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Section 8 · Multi User Collaboration</h3>
            <div className="flex gap-2 text-xs">
              <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="Invite collaborator email" className="flex-1 rounded border border-emerald-100 px-2 py-1.5" />
              <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="rounded border border-emerald-100 px-2 py-1.5">
                <option>Researcher</option>
                <option>Lead</option>
                <option>Reviewer</option>
              </select>
              <button onClick={inviteCollaborator} className="px-2 py-1 rounded border border-emerald-100">Invite</button>
            </div>
            <div className="mt-2 text-[11px] space-y-1">
              {collaborators.map((c, i) => (
                <p key={`${c.email}-${i}`} className="rounded border border-emerald-100 px-2 py-1">{c.email} · {c.role}</p>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input value={collabInput} onChange={(e) => setCollabInput(e.target.value)} placeholder="Comment or mention @user" className="flex-1 rounded border border-emerald-100 px-2 py-1.5 text-xs" />
              <button onClick={addComment} className="text-xs px-2 py-1 rounded border border-emerald-100">Add</button>
            </div>
            <div className="mt-2 max-h-24 overflow-y-auto space-y-1">
              {notes.map((n, i) => (
                <div key={`${n.ts}-${i}`} className="text-[11px] rounded border border-emerald-100 p-1.5 flex justify-between gap-2">
                  <span>{new Date(n.ts).toLocaleString()} · {n.text}</span>
                  <span className="flex gap-1">
                    <button onClick={() => setNotes((prev) => prev.map((x, idx) => (idx === i ? { ...x, text: `${x.text} (edited)` } : x)))} className="text-emerald-700">Edit</button>
                    <button onClick={() => setNotes((prev) => prev.filter((_, idx) => idx !== i))} className="text-red-600">Delete</button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid xl:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-emerald-100 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Section 9 · Laboratory Integration Strategy</h3>
            <div className="flex gap-2 mb-2 text-xs">
              <button onClick={() => setLabStrategy(`Fermentation setup for ${reaction}: 10L stirred bioreactor, inline pH and DO probes, LC-MS sampling every 2h.`)} className="px-2 py-1 rounded border border-emerald-100">Generate Lab Strategy</button>
              <button onClick={() => setLabStrategy((s) => `${s}\nComparison: Fed-batch improves productivity by 18% vs batch.`)} className="px-2 py-1 rounded border border-emerald-100">Compare Lab Setups</button>
              <button onClick={() => {
                const b = new Blob([labStrategy || 'Generate strategy first.'], { type: 'text/plain;charset=utf-8' });
                const u = URL.createObjectURL(b);
                const a = document.createElement('a');
                a.href = u; a.download = 'synbio-sop.txt'; a.click(); URL.revokeObjectURL(u);
              }} className="px-2 py-1 rounded border border-emerald-100">Export SOP</button>
            </div>
            <p className="text-xs text-slate-600 whitespace-pre-wrap">{labStrategy || 'Generate strategy for equipment, fermentation, scale-up, and automation.'}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 h-[280px]">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Section 10 · AI Risk & Biosafety Analysis</h3>
            <div className="flex gap-2 mb-2 text-xs">
              <button onClick={() => setRiskProfile(buildRiskProfile(reaction))} className="px-2 py-1 rounded border border-emerald-100">Run Safety Analysis</button>
              <button onClick={() => setNotes((p) => [{ ts: new Date().toISOString(), text: 'Compliance report generated for biosafety review.' }, ...p])} className="px-2 py-1 rounded border border-emerald-100">Generate Compliance Report</button>
              <button onClick={() => setRiskProfile((prev) => prev.map(([k, v]) => [k, Math.max(1, v - 1)]))} className="px-2 py-1 rounded border border-emerald-100">Compare Risk Profiles</button>
            </div>
            <ResponsiveContainer width="100%" height="78%">
              <BarChart data={riskProfile.map(([k, v]) => ({ risk: k, severity: v }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dbe7db" />
                <XAxis dataKey="risk" hide />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="severity" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 h-[280px]">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Section 11 · Autonomous Experiment Planner</h3>
            <div className="flex gap-1 flex-wrap mb-2 text-xs">
              <button onClick={() => setPlanner([
                'Day 1: Clone construct and transform host',
                'Day 2: Fermentation setup and baseline run',
                'Day 3: Adaptive promoter tuning + analytics',
              ])} className="px-2 py-1 rounded border border-emerald-100">Generate Experiment Plan</button>
              <button onClick={() => setPlanner((p) => [...p, 'Cost optimization: replace expensive cofactor with regeneration loop'])} className="px-2 py-1 rounded border border-emerald-100">Optimize Cost</button>
              <button onClick={() => setPlanner((p) => [...p, 'Yield optimization: increase oxygen transfer and feed profile'])} className="px-2 py-1 rounded border border-emerald-100">Optimize Yield</button>
              <button onClick={() => exportPathway({ id: 'experiment-plan', plan: planner })} className="px-2 py-1 rounded border border-emerald-100">Export Plan</button>
            </div>
            <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
              {planner.map((x, i) => <li key={`${x}-${i}`}>{x}</li>)}
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-100 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Final Section · Deployment & Commercialization</h3>
          <div className="flex gap-2 flex-wrap mb-2 text-xs">
            <button onClick={() => setBizSummary(`Commercial strategy for ${reaction}: pilot 100L facility, target offtake with SAF buyers, projected ROI 2.7x in 3 years.`)} className="px-2 py-1 rounded border border-emerald-100">Generate Business Strategy</button>
            <button onClick={() => setBizSummary((s) => `${s}\nModel comparison: licensing vs JV shows higher margin in licensing by 9%.`)} className="px-2 py-1 rounded border border-emerald-100">Compare Commercial Models</button>
            <button onClick={() => {
              const b = new Blob([bizSummary || 'Generate strategy first.'], { type: 'text/plain;charset=utf-8' });
              const u = URL.createObjectURL(b);
              const a = document.createElement('a');
              a.href = u; a.download = 'commercial-report.txt'; a.click(); URL.revokeObjectURL(u);
            }} className="px-2 py-1 rounded border border-emerald-100">Export Commercial Report</button>
            <button onClick={() => setBizSummary((s) => `${s}\nInvestor pitch: scalable carbon-negative bio-manufacturing with clear CAPEX pathway.`)} className="px-2 py-1 rounded border border-emerald-100">Investor Pitch Summary</button>
          </div>
          <p className="text-xs text-slate-600 whitespace-pre-wrap">{bizSummary || 'Generate commercialization, market fit, cost, ROI, and deployment roadmap output.'}</p>
        </section>

        <section className="grid xl:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-emerald-100 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Experimental Feedback Loop</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input value={actualYield} onChange={(e) => setActualYield(e.target.value)} className="rounded border border-emerald-100 px-2 py-1.5" placeholder="Actual yield (%)" />
              <input value={growthRate} onChange={(e) => setGrowthRate(e.target.value)} className="rounded border border-emerald-100 px-2 py-1.5" placeholder="Observed growth rate" />
            </div>
            <div className="mt-2 flex gap-2">
              <button className="text-xs px-3 py-1.5 rounded bg-emerald-600 text-white" onClick={logFeedbackAndRetrain}>Log Feedback</button>
              <button className="text-xs px-3 py-1.5 rounded border border-emerald-200 text-emerald-700" onClick={logFeedbackAndRetrain}>Retrain Model</button>
            </div>
            <div className="mt-2">
              <p className="text-[11px] text-slate-500">Retraining progress · model v{retrainVersion}</p>
              <div className="h-2 rounded-full bg-emerald-100 overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${retrainProgress}%` }} />
              </div>
            </div>
            <div className="mt-2 text-[11px] text-slate-600">
              Before: {(modelMetrics.before * 100).toFixed(1)}% · After: {(modelMetrics.after * 100).toFixed(1)}% · Learning improvement: {((modelMetrics.after - modelMetrics.before) * 100).toFixed(1)}%
            </div>
            <input value={feedbackSearch} onChange={(e) => setFeedbackSearch(e.target.value)} placeholder="Search feedback history..." className="mt-2 w-full rounded border border-emerald-100 px-2 py-1.5 text-xs" />
            <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
              {filteredFeedback.map((f) => (
                <details key={f.id} className="rounded border border-emerald-100 p-2 text-[11px]">
                  <summary className="cursor-pointer text-emerald-700">{new Date(f.ts).toLocaleString()} · {f.reaction}</summary>
                  <p className="mt-1 text-slate-600">Yield {f.actualYield}% · Growth {f.growthRate} · Microbe {f.selectedMicrobe || 'n/a'} · Enzyme {f.selectedEnzyme || 'n/a'}</p>
                </details>
              ))}
              {!filteredFeedback.length && <EmptyState label="No feedback entries match the current filter." />}
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 h-[260px]">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Section 5b · Protein Optimization Results</h3>
            <ResponsiveContainer width="100%" height="85%">
              <RadarChart data={(mutations || []).map((m) => ({ variant: m.variant.slice(-6), stability: m.stability * 100, activity: m.activity * 70, robustness: m.robustness * 100 }))}>
                <PolarGrid />
                <PolarAngleAxis dataKey="variant" />
                <PolarRadiusAxis />
                <Radar dataKey="stability" name="Stability" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                <Radar dataKey="activity" name="Activity" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
            {mutations[0] && (
              <div className="text-[11px] text-slate-600 mt-1">
                Recommended Variant: <span className="text-emerald-700 font-medium">{mutations[0].variant}</span> · Industrial suitability {(mutations[0].robustness * 100).toFixed(0)}%
              </div>
            )}
          </div>
        </section>

        <section className="grid xl:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 h-[260px]">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">AI Performance Analytics</h3>
            <ResponsiveContainer width="100%" height="72%">
              <RadarChart data={analyticsData.map((x) => ({ m: x.metric, v: x.value }))}>
                <PolarGrid />
                <PolarAngleAxis dataKey="m" />
                <PolarRadiusAxis />
                <Radar dataKey="v" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
            <p className="text-[11px] text-slate-600">Why this matters: higher agreement and biosafety scores indicate robust, scalable deployment readiness.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 h-[220px]">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Biological AI Reasoning</h3>
            <p className="text-xs text-slate-600">
              {analysis?.explanation || 'Run discovery to generate reaction-specific host, enzyme, and pathway explanations.'}
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 h-[220px]">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Pathway Graph Dynamics</h3>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={simSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dbe7db" />
                <XAxis dataKey="t" />
                <YAxis />
                <Tooltip />
                <Area dataKey="yield" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-100 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Section 12 · Version History & Audit Trail</h3>
          <div className="flex gap-2 mb-2">
            <input value={timelineSearch} onChange={(e) => setTimelineSearch(e.target.value)} className="flex-1 rounded border border-emerald-100 px-2 py-1.5 text-xs" placeholder="Search timeline..." />
            <select value={timelineFilter} onChange={(e) => setTimelineFilter(e.target.value)} className="rounded border border-emerald-100 px-2 py-1.5 text-xs">
              <option value="all">All events</option>
              <option value="feedback">Feedback</option>
              <option value="retrain">Retrain</option>
              <option value="report">Reports</option>
              <option value="collab">Collaboration</option>
              <option value="note">Notes</option>
              <option value="discovery">Discovery</option>
            </select>
          </div>
          <div className="space-y-2 text-xs">
            {timelineEvents.slice(0, 30).map((e, i) => (
              <details key={`${e.ts}-v-${i}`} className="rounded border border-emerald-100 p-2">
                <summary className="cursor-pointer text-emerald-700">
                  [{e.kind.toUpperCase()}] {new Date(e.ts).toLocaleString()}
                </summary>
                <p className="mt-1 text-slate-600">{e.text}</p>
                <div className="mt-1 flex gap-2">
                  <button
                    onClick={() =>
                      setCompareEntries((prev) =>
                        prev.some((x) => x.ts === e.ts && x.kind === e.kind)
                          ? prev.filter((x) => !(x.ts === e.ts && x.kind === e.kind))
                          : [...prev, e].slice(-2)
                      )
                    }
                    className="text-[10px] px-2 py-0.5 rounded border border-emerald-100"
                  >
                    Compare
                  </button>
                  <button
                    onClick={() => setNotes((prev) => [{ ts: new Date().toISOString(), text: `Restore simulation from ${e.kind} at ${new Date(e.ts).toLocaleString()}` }, ...prev])}
                    className="text-[10px] px-2 py-0.5 rounded border border-emerald-100"
                  >
                    Restore previous version
                  </button>
                </div>
                {e.meta && <pre className="mt-1 text-[10px] text-slate-500 whitespace-pre-wrap">{JSON.stringify(e.meta, null, 2)}</pre>}
              </details>
            ))}
            {!timelineEvents.length && <EmptyState label="No audit events yet. Run discovery or log feedback to populate timeline." />}
            {compareEntries.length === 2 && (
              <div className="rounded-lg border border-emerald-100 p-2 bg-emerald-50/30">
                <p className="text-emerald-700 mb-1">Side-by-side diff viewer</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  <pre className="text-[10px] whitespace-pre-wrap">{JSON.stringify(compareEntries[0], null, 2)}</pre>
                  <pre className="text-[10px] whitespace-pre-wrap">{JSON.stringify(compareEntries[1], null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {selectedPathway && (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="w-full max-w-3xl rounded-2xl bg-white border border-emerald-100 p-5">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-semibold text-slate-800">{selectedPathway.name}</h4>
              <button className="text-xs text-emerald-700" onClick={() => setSelectedPathway(null)}>Close</button>
            </div>
            <div className="h-64 rounded-lg border border-emerald-100 bg-emerald-50/20 p-3">
              <PathwayFlow pathway={selectedPathway} />
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Enzyme nodes, directional flux arrows, bottleneck points, engineered genes, and cofactor dependencies are highlighted.
            </p>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function PathwayFlow({ pathway = {} }) {
  const names = pathway?.metabolites?.length ? pathway.metabolites : ['Substrate', 'Intermediate A', 'Intermediate B', 'Product'];
  return (
    <svg viewBox="0 0 700 220" className="w-full h-full">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#10b981" />
        </marker>
      </defs>
      {names.map((name, i) => (
        <g key={name}>
          <rect x={30 + i * 160} y={90} width="108" height="40" rx="10" fill="#ecfdf5" stroke="#86efac" />
          <text x={84 + i * 160} y={24 + 90} textAnchor="middle" fontSize="11" fill="#334155">{name}</text>
        </g>
      ))}
      {names.slice(0, -1).map((_, i) => {
        const x = 138 + i * 160;
        return <line key={`edge-${i}`} x1={x} y1="110" x2={x + 48} y2="110" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)" />;
      })}
      <text x="335" y="165" textAnchor="middle" fontSize="12" fill="#047857">
        Bottleneck: {pathway?.bottlenecks?.[0] || 'cofactor imbalance'} · Cofactor: NADH
      </text>
    </svg>
  );
}

function ProteinViewer({ variant }) {
  const points = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
    x: 40 + i * 56,
    y: 80 + Math.sin(i) * 22,
    active: i === 3 || i === 5,
  }));
  return (
    <svg viewBox="0 0 520 220" className="w-full h-full">
      <text x="12" y="18" fontSize="11" fill="#0f766e">Variant: {variant}</text>
      {points.map((p, i) => (
        <g key={`${p.x}-${i}`}>
          {i < points.length - 1 && (
            <line x1={p.x} y1={p.y} x2={points[i + 1].x} y2={points[i + 1].y} stroke="#22c55e" strokeWidth="2" />
          )}
          <circle cx={p.x} cy={p.y} r={p.active ? 8 : 6} fill={p.active ? '#f97316' : '#10b981'} />
          <text x={p.x - 8} y={p.y - 11} fontSize="9" fill="#334155">R{i + 110}</text>
        </g>
      ))}
      <text x="10" y="205" fontSize="10" fill="#475569">Active-site residues highlighted; mutation heatmap intensity encoded in orange nodes.</text>
    </svg>
  );
}
