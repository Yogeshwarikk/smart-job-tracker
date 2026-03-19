import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', email: '', first_name: '', last_name: '', password: '', password2: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password2) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const msgs = Object.values(data).flat().join(' ');
        setError(msgs);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-animated flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-electric-600/8 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="w-full max-w-lg animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-electric-600 shadow-lg shadow-electric-600/40 mb-4">
            <span className="font-display font-bold text-xl">SJ</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-ink-50">Create account</h1>
          <p className="text-ink-400 mt-1.5 text-sm">Start tracking your job search today</p>
        </div>

        <div className="card space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink-300 mb-1.5">First Name</label>
                <input name="first_name" value={form.first_name} onChange={handle} placeholder="Jane" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-300 mb-1.5">Last Name</label>
                <input name="last_name" value={form.last_name} onChange={handle} placeholder="Doe" className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-1.5">Username <span className="text-red-400">*</span></label>
              <input name="username" value={form.username} onChange={handle} required placeholder="jane_doe" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-1.5">Email</label>
              <input type="email" name="email" value={form.email} onChange={handle} placeholder="jane@example.com" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-1.5">Password <span className="text-red-400">*</span></label>
              <input type="password" name="password" value={form.password} onChange={handle} required placeholder="Min 6 characters" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-1.5">Confirm Password <span className="text-red-400">*</span></label>
              <input type="password" name="password2" value={form.password2} onChange={handle} required placeholder="••••••••" className="input-field" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account…</>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-ink-400">
            Already have an account?{' '}
            <Link to="/login" className="text-electric-400 hover:text-electric-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
