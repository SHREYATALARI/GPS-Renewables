import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/AppShell.jsx';
import { projectsApi, activityApi } from '../api/client.js';
import LightCard from '../components/LightCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import SustainabilityButton from '../components/SustainabilityButton.jsx';

function formatAction(action) {
  const map = {
    login: 'Signed in',
    signup: 'Registered',
    project_created: 'Created project',
    collaborator_invited: 'Invited collaborator',
    research_run: 'Ran research pipeline',
    feedback_logged: 'Logged experimental result',
    project_version_updated: 'Project version updated',
  };
  return map[action] || action;
}

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  async function load() {
    setLoading(true);
    try {
      const [p, a] = await Promise.all([projectsApi.list(), activityApi.mine()]);
      setProjects(p.projects || []);
      setActivity(a.activity || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createProject(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await projectsApi.create({ name: newName.trim(), description: newDesc.trim() });
      setNewName('');
      setNewDesc('');
      await load();
    } catch (err) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <AppShell title="Dashboard">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
            <SectionHeader
              title="Your research projects"
              subtitle="Shared workspaces for catalyst and enzyme discovery workflows."
            />
            <Link
              to="/dashboard#create-form"
              className="inline-flex text-sm px-4 py-2 rounded-full bg-[#3FAE49] text-white font-medium hover:bg-[#369740]"
            >
              Create New Research
            </Link>
          </div>

          {loading ? (
            <p className="text-slate-500 text-sm">Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="text-slate-500 text-sm">
              No projects yet. Create one below to start a research workflow.
            </p>
          ) : (
            <ul className="grid sm:grid-cols-2 gap-4">
              {projects.map((p) => (
                <LightCard key={p.id} className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex justify-between gap-2">
                    <div>
                      <h3 className="font-medium text-slate-900">{p.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">v{p.version}</p>
                    </div>
                    <Link
                      to={`/project/${p.id}`}
                      className="text-xs text-emerald-700 hover:text-emerald-600 self-start"
                    >
                      Open →
                    </Link>
                  </div>
                  <p className="text-sm text-slate-500 mt-3 line-clamp-2">{p.description || '—'}</p>
                  <div className="mt-4 flex gap-2">
                    <Link
                      to={`/project/${p.id}/research`}
                      className="text-xs px-3 py-1.5 rounded-full border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      Run pipeline
                    </Link>
                  </div>
                </LightCard>
              ))}
            </ul>
          )}
        </section>

        <LightCard id="create-form" className="p-6 max-w-xl">
          <SectionHeader
            title="Create New Research"
            subtitle="Projects hold collaborators, runs, and activity history."
            className="mb-4"
          />
          <form onSubmit={createProject} className="space-y-3">
            <input
              className="w-full rounded-lg bg-white border border-emerald-100 px-3 py-2 text-sm"
              placeholder="Project name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <textarea
              className="w-full rounded-lg bg-white border border-emerald-100 px-3 py-2 text-sm min-h-[80px]"
              placeholder="Description (optional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
            <SustainabilityButton type="submit" disabled={creating} className="rounded-lg">
              {creating ? 'Creating…' : 'Create project'}
            </SustainabilityButton>
          </form>
        </LightCard>

        <section>
          <SectionHeader title="Activity log" className="mb-4" />
          <LightCard className="divide-y divide-emerald-100 max-h-[420px] overflow-y-auto">
            {activity.length === 0 ? (
              <p className="p-6 text-sm text-slate-500">No recent activity.</p>
            ) : (
              activity.map((a) => (
                <div key={a.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="text-xs text-slate-500 w-40 shrink-0">
                    {new Date(a.createdAt).toLocaleString()}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-medium text-emerald-700 uppercase tracking-wide">
                      {formatAction(a.action)}
                    </span>
                    <p className="text-sm text-slate-700">{a.summary || a.action}</p>
                    {a.project?.name && (
                      <p className="text-xs text-slate-600 mt-0.5">Project: {a.project.name}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </LightCard>
        </section>
      </div>
    </AppShell>
  );
}
