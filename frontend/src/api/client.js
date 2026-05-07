/**
 * Thin API layer — swap base URL via VITE_API_URL.
 * Authentication is stateless: Bearer token from localStorage per browser profile (no shared server session).
 * FUTURE: Axios interceptors, retries, typed OpenAPI client generation.
 */
const API = import.meta.env.VITE_API_URL;

function getToken() {
  return localStorage.getItem('gps_token');
}

export async function api(path, options = {}) {
  if (!API) {
    throw new Error('Missing VITE_API_URL. Please configure frontend/.env');
  }
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API}${path}`, { ...options, headers });
  } catch (cause) {
    const err = new Error('Failed to fetch. Please check that API server is running and VITE_API_URL is correct.');
    err.status = 0;
    err.cause = cause;
    throw err;
  }
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || 'Invalid response' };
  }
  if (!res.ok) {
    const err = new Error(data.message || res.statusText || 'Request failed');
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export const authApi = {
  login: async (body) => {
    const url = `${API}/auth/login`;
    try {
      const data = await api('/auth/login', { method: 'POST', body: JSON.stringify(body) });
      return data;
    } catch (e) {
      console.error('[auth] login failed', { url, message: e.message, status: e.status });
      throw new Error(e.message || 'Login failed');
    }
  },
  register: async (body) => {
    const url = `${API}/auth/signup`;
    try {
      const data = await api('/auth/signup', { method: 'POST', body: JSON.stringify(body) });
      return data;
    } catch (e) {
      console.error('[auth] signup failed', { url, message: e.message, status: e.status });
      throw new Error(e.message || 'Signup failed');
    }
  },
};

export const projectsApi = {
  list: () => api('/projects'),
  get: (id) => api(`/projects/${id}`),
  create: (body) => api('/projects', { method: 'POST', body: JSON.stringify(body) }),
  invite: (id, email) =>
    api(`/projects/${id}/invite`, { method: 'POST', body: JSON.stringify({ email }) }),
};

export const researchApi = {
  run: (body) => api('/research/run', { method: 'POST', body: JSON.stringify(body) }),
  listByProject: (projectId) => api(`/research/projects/${projectId}/runs`),
  get: (runId) => api(`/research/runs/${runId}`),
};

export const activityApi = {
  mine: () => api('/activity/me'),
  project: (projectId) => api(`/activity/project/${projectId}`),
};

export const feedbackApi = {
  log: (body) => api('/feedback', { method: 'POST', body: JSON.stringify(body) }),
  listForRun: (runId) => api(`/feedback/run/${runId}`),
};

export const collaborationApi = {
  comments: (projectId) => api(`/collaboration/project/${projectId}/comments`),
  addComment: (projectId, body) =>
    api(`/collaboration/project/${projectId}/comments`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

export const versionApi = {
  list: (projectId) => api(`/version-history/project/${projectId}`),
  retrain: (projectId) =>
    api(`/version-history/project/${projectId}/retrain`, {
      method: 'POST',
      body: JSON.stringify({}),
    }),
};

export const scientificApi = {
  analyzeCatalysis: (body) => api('/catalysis/analyze', { method: 'POST', body: JSON.stringify(body) }),
  optimizeCatalysis: (body) => api('/catalysis/optimize', { method: 'POST', body: JSON.stringify(body) }),
  generatePathway: (body) => api('/synbio/pathway', { method: 'POST', body: JSON.stringify(body) }),
  predictProtein: (body) => api('/synbio/protein', { method: 'POST', body: JSON.stringify(body) }),
  exportResearch: (body) => api('/research/export', { method: 'POST', body: JSON.stringify(body) }),
};
