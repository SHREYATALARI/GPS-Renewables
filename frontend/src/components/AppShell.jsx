import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Beaker,
  BrainCircuit,
  ChevronLeft,
  FlaskConical,
  Home,
  MessageSquare,
  SendToBack,
  Settings,
  Share2,
  Sparkles,
  Bell,
  UserRound,
  Dna,
  Download,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { DOMAIN_CATALYSIS, DOMAIN_SYNBIO, useDomainStore } from '../stores/domainStore.js';
import { scientificApi } from '../api/client.js';

const CATALYSIS_NAV_ITEMS = [
  { label: 'Dashboard', icon: Home, href: '/dashboard' },
  { label: 'Catalyst Discovery', icon: BrainCircuit, href: '/pipeline' },
  { label: 'Reaction Optimization', icon: Sparkles, href: '/ai-candidates' },
  { label: 'Simulations', icon: Activity, href: '/simulations' },
  { label: 'Industrial Scale Simulation', icon: FlaskConical, href: '/experiments' },
  { label: 'Green Chemistry Metrics', icon: MessageSquare, href: '/feedback-loop' },
  { label: 'Collaboration', icon: Share2, href: '/collaboration' },
  { label: 'Export Center', icon: SendToBack, href: '/export-center' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

const SYNBIO_NAV_ITEMS = [
  { label: 'Dashboard', icon: Home, href: '/synthetic-biology/dashboard' },
  { label: 'Metabolic Pathway Design', icon: BrainCircuit, href: '/synthetic-biology/pathways' },
  { label: 'Enzyme Engineering', icon: Dna, href: '/synthetic-biology/proteins' },
  { label: 'Microbial Strain Suggestions', icon: Sparkles, href: '/synthetic-biology/research' },
  { label: 'Genetic Circuit Builder', icon: Activity, href: '/synthetic-biology/research' },
  { label: 'Biofuel Optimization', icon: FlaskConical, href: '/synthetic-biology/experiments' },
  { label: 'Protein Stability Prediction', icon: MessageSquare, href: '/synthetic-biology/research' },
  { label: 'Collaboration', icon: Share2, href: '/synthetic-biology/collaboration' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

export default function AppShell({
  children,
  title,
  projectBadge,
  modelBadge,
  reactionOptions = [],
  selectedReaction = '',
  onReactionChange,
  onlineResearchers = 0,
}) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantLog, setAssistantLog] = useState([]);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [workflowStep, setWorkflowStep] = useState(0);
  const [savedReports, setSavedReports] = useState([]);
  const domain = useDomainStore((s) => s.domain);
  const setDomain = useDomainStore((s) => s.setDomain);

  const initials = useMemo(() => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map((v) => v[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [user?.name]);

  useEffect(() => {
    if (location.pathname.startsWith('/synthetic-biology')) setDomain(DOMAIN_SYNBIO);
    else setDomain(DOMAIN_CATALYSIS);
  }, [location.pathname, setDomain]);

  const navItems = domain === DOMAIN_SYNBIO ? SYNBIO_NAV_ITEMS : CATALYSIS_NAV_ITEMS;
  const filteredNavItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );
  const moduleContext = useMemo(() => {
    const path = location.pathname;
    if (domain === DOMAIN_CATALYSIS) {
      if (path.includes('/pipeline')) return { name: 'Catalyst Discovery', prompt: 'Screen catalyst families for CO2 hydrogenation', actions: ['optimize', 'yield', 'simulation'] };
      if (path.includes('/ai-candidates')) return { name: 'Reaction Optimization', prompt: 'Compare selectivity trade-offs for top catalyst candidates', actions: ['yield', 'optimize', 'export'] };
      if (path.includes('/simulations')) return { name: 'Simulations', prompt: 'Run industrial-scale simulation at 50 bar and 523 K', actions: ['simulation', 'yield', 'export'] };
      if (path.includes('/experiments')) return { name: 'Industrial Scale Simulation', prompt: 'Estimate catalyst deactivation risk under extended run', actions: ['simulation', 'optimize', 'export'] };
      if (path.includes('/feedback-loop')) return { name: 'Green Chemistry Metrics', prompt: 'Assess carbon-intensity reduction for selected catalyst', actions: ['yield', 'simulation', 'export'] };
      return { name: 'Dashboard', prompt: 'Summarize best catalyst recommendation and confidence', actions: ['yield', 'optimize', 'export'] };
    }
    if (path.includes('/pathways')) return { name: 'Metabolic Pathway Design', prompt: 'Generate pathway alternatives for SAF precursor synthesis', actions: ['pathway', 'simulation', 'export'] };
    if (path.includes('/proteins')) return { name: 'Enzyme Engineering', prompt: 'Predict mutation impact for protein stability and activity', actions: ['protein', 'simulation', 'export'] };
    if (path.includes('/experiments')) return { name: 'Biofuel Optimization', prompt: 'Calibrate pathway yield using latest fermentation observations', actions: ['pathway', 'protein', 'export'] };
    if (path.includes('/collaboration')) return { name: 'Collaboration', prompt: 'Summarize key team notes and pending experimental actions', actions: ['pathway', 'simulation', 'export'] };
    return { name: 'Synthetic Biology Dashboard', prompt: 'Recommend host strain and enzyme cocktail for target conversion', actions: ['pathway', 'protein', 'export'] };
  }, [domain, location.pathname]);

  function switchDomain(nextDomain) {
    if (nextDomain === domain) return;
    setDomain(nextDomain);
    const map = {
      '/dashboard': '/synthetic-biology/dashboard',
      '/pipeline': '/synthetic-biology/research',
      '/ai-candidates': '/synthetic-biology/pathways',
      '/simulations': '/synthetic-biology/research',
      '/experiments': '/synthetic-biology/experiments',
      '/feedback-loop': '/synthetic-biology/research',
      '/collaboration': '/synthetic-biology/collaboration',
      '/settings': '/settings',
      '/export-center': '/synthetic-biology/research',
      '/synthetic-biology/dashboard': '/dashboard',
      '/synthetic-biology/research': '/pipeline',
      '/synthetic-biology/pathways': '/ai-candidates',
      '/synthetic-biology/proteins': '/ai-candidates',
      '/synthetic-biology/experiments': '/experiments',
      '/synthetic-biology/collaboration': '/collaboration',
    };
    navigate(map[location.pathname] || (nextDomain === DOMAIN_SYNBIO ? '/synthetic-biology/dashboard' : '/dashboard'));
  }

  async function runAssistantAction(action) {
    setAssistantLoading(true);
    try {
      let out;
      if (domain === DOMAIN_CATALYSIS) {
        if (action === 'optimize') out = await scientificApi.optimizeCatalysis({ targetReaction: selectedReaction || 'CO2 hydrogenation' });
        else if (action === 'yield') out = await scientificApi.analyzeCatalysis({ targetReaction: selectedReaction || 'CO2 hydrogenation' });
        else out = await scientificApi.analyzeCatalysis({ targetReaction: assistantInput || 'Methanol synthesis' });
      } else if (action === 'pathway') out = await scientificApi.generatePathway({ objective: 'Yield Maximization' });
      else if (action === 'protein') out = await scientificApi.predictProtein({});
      else out = await scientificApi.generatePathway({ objective: assistantInput || 'Biofuel optimization' });

      setAssistantLog((prev) => [{ ts: new Date().toISOString(), action, out }, ...prev].slice(0, 8));
      if (action === 'export') {
        const report = await scientificApi.exportResearch({
          domain,
          reportType: 'interactive-assistant',
        });
        const blob = new Blob([report.reportText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gps-${domain}-report.txt`;
        a.click();
        URL.revokeObjectURL(url);
        setSavedReports((prev) => [{ ts: new Date().toISOString(), text: report.reportText }, ...prev].slice(0, 5));
      }
    } catch (e) {
      setAssistantLog((prev) => [{ ts: new Date().toISOString(), action, out: { error: e.message } }, ...prev].slice(0, 8));
    } finally {
      setAssistantLoading(false);
    }
  }

  function runPrimaryAction(slot) {
    const action = moduleContext.actions[slot];
    if (!action) return;
    if (!assistantInput.trim()) setAssistantInput(moduleContext.prompt);
    runAssistantAction(action);
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute -top-24 -left-12 h-72 w-72 rounded-full bg-emerald-200/45 blur-3xl" />
        <div className="absolute top-1/3 -right-8 h-72 w-72 rounded-full bg-lime-100/50 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        <motion.aside
          animate={{ width: collapsed ? 78 : 260 }}
          transition={{ type: 'spring', stiffness: 240, damping: 26 }}
          className="border-r border-emerald-100 bg-white/90 backdrop-blur p-3 flex flex-col shadow-sm"
        >
          <div className="flex items-center justify-between px-2 pt-2 pb-4">
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="flex items-center gap-2"
                >
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                    <Beaker className="h-4 w-4 text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">GPS Renewables</p>
                    <p className="text-sm font-semibold text-slate-800">Research Platform</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setCollapsed((s) => !s)}
              className="h-8 w-8 rounded-md border border-emerald-100 text-slate-500 hover:text-emerald-700 hover:border-emerald-300 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="mb-2 rounded-lg border border-emerald-100 px-2 py-1.5 flex items-center gap-1">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            {!collapsed && (
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Filter modules"
                className="w-full bg-transparent text-xs outline-none"
              />
            )}
          </div>
          <nav className="space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-all ${
                      isActive
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                        : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-emerald-100 hover:bg-emerald-50/60'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto pt-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              <p className="font-medium">Researchers online</p>
              <p className="text-emerald-600 mt-1">{onlineResearchers} active sessions</p>
            </div>
          </div>
        </motion.aside>

        <div className="flex-1 min-w-0 flex flex-col">
          <header className="border-b border-emerald-100 bg-white/90 backdrop-blur sticky top-0 z-20 shadow-sm">
            <div className="px-4 md:px-6 py-3 flex items-center gap-3">
              <Link to="/dashboard" className="hidden md:flex flex-col min-w-[180px]">
                <span className="text-[11px] text-slate-500">Industrial AI R&amp;D Platform</span>
                <span className="text-sm font-semibold text-slate-800">GPS Catalyst AI</span>
              </Link>

              {reactionOptions.length > 0 && (
                <select
                  value={selectedReaction}
                  onChange={(e) => onReactionChange?.(e.target.value)}
                  className="max-w-[260px] w-full bg-white border border-emerald-100 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  <option value="">Select reaction focus</option>
                  {reactionOptions.map((r) => (
                    <option value={r} key={r}>
                      {r}
                    </option>
                  ))}
                </select>
              )}

              <div className="hidden md:flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 p-1">
                <button
                  type="button"
                  onClick={() => switchDomain(DOMAIN_CATALYSIS)}
                  className={`text-[11px] px-3 py-1 rounded-full transition ${
                    domain === DOMAIN_CATALYSIS ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Chemical Catalysis
                </button>
                <button
                  type="button"
                  onClick={() => switchDomain(DOMAIN_SYNBIO)}
                  className={`text-[11px] px-3 py-1 rounded-full transition ${
                    domain === DOMAIN_SYNBIO ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Synthetic Biology
                </button>
              </div>

              <div className="hidden lg:flex items-center gap-2 ml-auto">
                {projectBadge && (
                  <span className="text-[11px] px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
                    {projectBadge}
                  </span>
                )}
                {modelBadge && (
                  <span className="text-[11px] px-2.5 py-1 rounded-full border border-lime-200 bg-lime-50 text-lime-700">
                    {modelBadge}
                  </span>
                )}
              </div>

              <button className="h-9 w-9 rounded-lg border border-emerald-100 bg-white flex items-center justify-center text-slate-600 hover:text-emerald-700">
                <Bell className="h-4 w-4" />
              </button>
              <div className="h-9 px-2.5 rounded-lg border border-emerald-100 bg-white flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-[10px] font-semibold text-emerald-700">
                  {initials}
                </div>
                <span className="hidden sm:inline text-xs text-slate-700">{user?.name}</span>
                <UserRound className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="text-xs px-3 py-2 rounded-lg border border-emerald-100 text-slate-700 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
              >
                Sign out
              </button>
            </div>
            <div className="px-4 md:px-6 pb-3">
              {title && <h1 className="text-lg font-semibold text-slate-900 tracking-tight">{title}</h1>}
            </div>
          </header>

          <main className="flex-1 px-4 md:px-6 py-6 overflow-x-hidden">
            <div className="grid xl:grid-cols-[minmax(0,1fr),320px] gap-4">
              <div>{children}</div>
              <aside className="rounded-2xl border border-emerald-100 bg-white p-3 h-fit sticky top-24">
                <p className="text-xs font-semibold text-emerald-700">AI Research Assistant</p>
                <p className="mt-1 text-[11px] text-slate-500">Context: {moduleContext.name}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {moduleContext.actions.map((a) => (
                    <button
                      key={a}
                      onClick={() => runAssistantAction(a)}
                      className="text-[10px] px-2 py-0.5 rounded-full border border-emerald-100 text-emerald-700"
                    >
                      {a}
                    </button>
                  ))}
                </div>
                <textarea
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  className="mt-2 w-full min-h-[72px] rounded-lg border border-emerald-100 px-2 py-1.5 text-xs"
                  placeholder={moduleContext.prompt}
                />
                <div className="mt-2 grid grid-cols-2 gap-1">
                  <button onClick={() => runPrimaryAction(0)} className="text-[11px] px-2 py-1 rounded border border-emerald-100">Generate</button>
                  <button onClick={() => runPrimaryAction(1)} className="text-[11px] px-2 py-1 rounded border border-emerald-100">Predict Yield</button>
                  <button onClick={() => runPrimaryAction(2)} className="text-[11px] px-2 py-1 rounded border border-emerald-100">Run Simulation</button>
                  <button onClick={() => runAssistantAction('export')} className="text-[11px] px-2 py-1 rounded border border-emerald-100 inline-flex items-center justify-center gap-1"><Download className="h-3 w-3" />Export</button>
                </div>
                <div className="mt-3 rounded-lg border border-emerald-100 p-2">
                  <p className="text-[11px] text-slate-500">Workflow Builder</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {(domain === DOMAIN_CATALYSIS
                      ? ['Discovery', 'Optimize', 'Mechanism', 'Scale-up']
                      : ['Pathway', 'Mutation', 'Flux', 'Fermentation']
                    ).map((s, idx) => (
                      <button
                        key={s}
                        onClick={() => setWorkflowStep(idx)}
                        className={`text-[10px] px-2 py-1 rounded border ${
                          workflowStep === idx ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-emerald-100'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1">Step status: {workflowStep + 1} / 4 executed.</p>
                </div>
                <div className="mt-3 rounded-lg border border-emerald-100 p-2 max-h-44 overflow-y-auto">
                  <p className="text-[11px] text-slate-500">Simulation Console {assistantLoading ? '· running...' : ''}</p>
                  {assistantLog.map((entry, i) => (
                    <div key={`${entry.ts}-${i}`} className="mt-1 text-[10px] text-slate-600 border-b border-emerald-50 pb-1">
                      <p>{new Date(entry.ts).toLocaleTimeString()} · {entry.action}</p>
                      <p className="text-emerald-700">{entry.out?.error || entry.out?.explanation || `confidence ${entry.out?.confidence ?? 'n/a'}`}</p>
                      {entry.out?.recommendations?.length > 0 && (
                        <p className="text-[10px] text-slate-600">
                          Top catalyst: {entry.out.recommendations[0].name} · conversion {Math.round((entry.out.recommendations[0].conversionEfficiency || 0) * 100)}% ·
                          selectivity {Math.round((entry.out.recommendations[0].selectivity || 0) * 100)}%
                        </p>
                      )}
                      {entry.out?.optimizationSuggestions?.length > 0 && (
                        <p className="text-[10px] text-slate-600">
                          Optimization: {entry.out.optimizationSuggestions[0]}
                        </p>
                      )}
                      {entry.out?.pathways?.length > 0 && (
                        <p className="text-[10px] text-slate-600">
                          Pathway: {entry.out.pathways[0].name} · yield {entry.out.pathways[0].predictedYield}% · novelty {entry.out.pathways[0].noveltyScore}
                        </p>
                      )}
                      {entry.out?.organisms?.length > 0 && (
                        <p className="text-[10px] text-slate-600">
                          Host suggestions: {entry.out.organisms.slice(0, 2).join(', ')}
                        </p>
                      )}
                      {entry.out?.mutations?.length > 0 && (
                        <p className="text-[10px] text-slate-600">
                          Mutation: {entry.out.mutations[0].enzyme} → {entry.out.mutations[0].recommendation} · stability {entry.out.mutations[0].stabilityScore}
                        </p>
                      )}
                    </div>
                  ))}
                  {!assistantLog.length && <p className="text-[10px] text-slate-500 mt-1">No runs yet.</p>}
                </div>
                {savedReports.length > 0 && (
                  <div className="mt-2 text-[10px] text-slate-600">
                    <p className="text-slate-500">Saved reports</p>
                    {savedReports.map((r, i) => (
                      <p key={`${r.ts}-${i}`}>{new Date(r.ts).toLocaleTimeString()} · report generated</p>
                    ))}
                  </div>
                )}
              </aside>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
