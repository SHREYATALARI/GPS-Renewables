import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppShell from '../components/AppShell.jsx';
import { projectsApi, activityApi } from '../api/client.js';
import LightCard from '../components/LightCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import SustainabilityButton from '../components/SustainabilityButton.jsx';

function formatAction(action) {
  const map = {
    collaborator_invited: 'Invitation',
    research_run: 'Research run',
    feedback_logged: 'Feedback',
    project_version_updated: 'Version',
    project_created: 'Created',
  };
  return map[action] || action;
}

export default function ProjectPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [activity, setActivity] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [p, a] = await Promise.all([
        projectsApi.get(projectId),
        activityApi.project(projectId),
      ]);
      setProject(p.project);
      setActivity(a.activity || []);
    } catch (e) {
      console.error(e);
      setProject(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [projectId]);

  async function invite(e) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      await projectsApi.invite(projectId, inviteEmail.trim());
      setInviteEmail('');
      await load();
    } catch (err) {
      alert(err.message);
    } finally {
      setInviting(false);
    }
  }

  if (loading && !project) {
    return (
      <AppShell title="Project">
        <div className="max-w-6xl mx-auto px-4 py-16 text-slate-500 text-sm">Loading...</div>
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell title="Project">
        <div className="max-w-6xl mx-auto px-4 py-16 text-red-400 text-sm">Project not found.</div>
      </AppShell>
    );
  }

  return (
    <AppShell title={project.name}>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        <div className="flex flex-wrap gap-4 justify-between items-start">
          <div>
            <p className="text-xs text-slate-500 mb-1">v{project.version}</p>
            <p className="text-slate-700 max-w-2xl">{project.description || 'No description.'}</p>
            <p className="text-xs text-slate-600 mt-2">
              Owner:{' '}
              {typeof project.owner === 'object'
                ? `${project.owner?.name} (${project.owner?.email})`
                : '—'}
            </p>
          </div>
          <Link
            to={`/project/${projectId}/research`}
            className="text-sm px-5 py-2.5 rounded-full bg-[#3FAE49] text-white font-semibold"
          >
            Research workflow →
          </Link>
        </div>

        <section className="grid lg:grid-cols-2 gap-8">
          <LightCard className="p-6">
            <SectionHeader title="Collaborators" className="mb-4" />
            <ul className="space-y-3 mb-6">
              <li className="text-sm text-slate-700 flex justify-between">
                <span>
                  {typeof project.owner === 'object' ? project.owner?.name : 'Owner'}{' '}
                  <span className="text-emerald-700 text-xs ml-2">owner</span>
                </span>
              </li>
              {(project.collaborators || []).map((c, i) => (
                <li key={i} className="text-sm text-slate-600 flex justify-between">
                  <span>
                    {typeof c.user === 'object'
                      ? `${c.user?.name} · ${c.user?.email}`
                      : 'Collaborator'}
                  </span>
                  <span className="text-xs uppercase text-slate-600">{c.status}</span>
                </li>
              ))}
            </ul>
            <form onSubmit={invite} className="space-y-2">
              <label className="text-xs text-slate-500">Invite by email (registered users)</label>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-lg bg-white border border-emerald-100 px-3 py-2 text-sm"
                  placeholder="colleague@lab.org"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  type="email"
                />
                <SustainabilityButton type="submit" disabled={inviting} className="rounded-lg text-xs px-4">
                  {inviting ? '…' : 'Invite'}
                </SustainabilityButton>
              </div>
            </form>
          </LightCard>

          <LightCard className="p-6 max-h-[360px] overflow-y-auto">
            <SectionHeader title="Project activity" className="mb-4" />
            {activity.length === 0 ? (
              <p className="text-sm text-slate-500">No activity yet.</p>
            ) : (
              <ul className="space-y-3">
                {activity.map((a) => (
                  <li key={a.id} className="text-sm border-b border-emerald-100 pb-3 last:border-0">
                    <div className="flex justify-between gap-2">
                      <span className="text-emerald-700 text-xs uppercase">
                        {formatAction(a.action)}
                      </span>
                      <span className="text-xs text-slate-600">
                        {new Date(a.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-700 mt-1">{a.summary}</p>
                    {a.actor?.name && (
                      <p className="text-xs text-slate-600 mt-1">By {a.actor.name}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </LightCard>
        </section>

        <p className="text-xs text-slate-600">
          {/* FUTURE: real-time presence, fine-grained roles */}
          Shared workspace · All members can run pipelines and log experiments.
        </p>
      </div>
    </AppShell>
  );
}
