import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const STATUSES = ['applied', 'interview', 'offer', 'selected', 'rejected', 'withdrawn'];

const INIT = {
  company: '', role: '', status: 'applied',
  date_applied: new Date().toISOString().split('T')[0],
  location: '', job_url: '', salary_range: '', notes: '',
};

export default function AddJobPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INIT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/jobs/applications/', form);
      setSuccess(true);
      setTimeout(() => navigate('/jobs'), 1200);
    } catch (err) {
      const data = err.response?.data;
      setError(data ? Object.values(data).flat().join(' ') : 'Failed to save application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl animate-slide-up">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink-50">Add Application</h1>
        <p className="text-ink-400 text-sm mt-1">Track a new job you've applied to</p>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
          <span>✓</span> Application saved! Redirecting…
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="card space-y-5">
        {/* Required fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-300 mb-1.5">
              Company <span className="text-red-400">*</span>
            </label>
            <input name="company" value={form.company} onChange={handle} required
              placeholder="e.g. Google" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-300 mb-1.5">
              Role <span className="text-red-400">*</span>
            </label>
            <input name="role" value={form.role} onChange={handle} required
              placeholder="e.g. Software Engineer" className="input-field" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-300 mb-1.5">
              Status <span className="text-red-400">*</span>
            </label>
            <select name="status" value={form.status} onChange={handle}
              className="input-field capitalize">
              {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-300 mb-1.5">
              Date Applied <span className="text-red-400">*</span>
            </label>
            <input type="date" name="date_applied" value={form.date_applied} onChange={handle}
              required className="input-field" />
          </div>
        </div>

        {/* Optional fields */}
        <div className="border-t border-ink-800/50 pt-4 space-y-4">
          <p className="text-xs text-ink-500 font-medium uppercase tracking-wider">Optional Details</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-1.5">Location</label>
              <input name="location" value={form.location} onChange={handle}
                placeholder="e.g. Remote / NYC" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-1.5">Salary Range</label>
              <input name="salary_range" value={form.salary_range} onChange={handle}
                placeholder="e.g. $80k – $100k" className="input-field" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-300 mb-1.5">Job Posting URL</label>
            <input type="url" name="job_url" value={form.job_url} onChange={handle}
              placeholder="https://…" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-300 mb-1.5">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handle} rows={3}
              placeholder="Recruiter name, impressions, referral info…"
              className="input-field resize-none" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading || success} className="btn-primary flex items-center gap-2">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
              : 'Save Application'
            }
          </button>
          <button type="button" onClick={() => navigate('/jobs')} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
