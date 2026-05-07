import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import LightCard from '../components/LightCard.jsx';
import SustainabilityButton from '../components/SustainabilityButton.jsx';

export default function Signup() {
  const { loginSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const domain = new URLSearchParams(location.search).get('domain');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.register({ name, email, password });
      loginSession(data.token, data.user);
      navigate(domain === 'synthetic-biology' ? '/synthetic-biology/dashboard' : '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F8FBF8]">
      <LightCard className="w-full max-w-md p-8">
        <h1 className="text-xl font-semibold text-slate-900 mb-1">Create account</h1>
        <p className="text-sm text-slate-600 mb-6">Join a shared R&amp;D workspace for your team.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-600 mb-1">Name</label>
            <input
              className="w-full rounded-lg bg-white border border-emerald-100 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">Email</label>
            <input
              className="w-full rounded-lg bg-white border border-emerald-100 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">Password</label>
            <input
              className="w-full rounded-lg bg-white border border-emerald-100 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <SustainabilityButton type="submit" disabled={loading} className="w-full py-2.5 rounded-lg">
            {loading ? 'Creating…' : 'Sign Up'}
          </SustainabilityButton>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Have an account?{' '}
          <Link to={`/login${domain ? `?domain=${domain}` : ''}`} className="text-emerald-700 hover:text-emerald-600">
            Login
          </Link>
        </p>
      </LightCard>
    </div>
  );
}
