import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUSES = ['all', 'applied', 'interview', 'offer', 'selected', 'rejected', 'withdrawn'];

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [editingJob, setEditingJob] = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/jobs/applications/');
      setJobs(data.results ?? data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const deleteJob = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    setDeletingId(id);
    await api.delete(`/jobs/applications/${id}/`);
    setJobs(prev => prev.filter(j => j.id !== id));
    setDeletingId(null);
  };

  const updateStatus = async (job, status) => {
    const { data } = await api.patch(`/jobs/applications/${job.id}/`, { status });
    setJobs(prev => prev.map(j => j.id === data.id ? data : j));
    setEditingJob(null);
  };

  const filtered = jobs.filter(j => {
    const matchFilter = filter === 'all' || j.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || j.company.toLowerCase().includes(q) || j.role.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-50">Applications</h1>
          <p className="text-ink-400 text-sm mt-1">{jobs.length} total tracked</p>
        </div>
        <Link to="/add-job" className="btn-primary text-sm">+ Add Job</Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search company or role…"
          className="input-field max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 capitalize
                ${filter === s
                  ? 'bg-electric-600 text-white shadow-lg shadow-electric-600/20'
                  : 'glass text-ink-300 hover:text-ink-100'
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? <LoadingSpinner /> : (
        <div className="card p-0 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-ink-500">
              <p className="text-4xl mb-3">◈</p>
              <p className="text-sm">No applications found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ink-800/60">
                    {['Company', 'Role', 'Status', 'Applied', 'Location', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-medium text-ink-400 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-800/40">
                  {filtered.map(job => (
                    <tr key={job.id} className="hover:bg-ink-800/30 transition-colors group">
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-ink-100">{job.company}</p>
                        {job.job_url && (
                          <a href={job.job_url} target="_blank" rel="noreferrer"
                             className="text-xs text-electric-400 hover:underline">
                            View posting ↗
                          </a>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-ink-200">{job.role}</td>
                      <td className="px-5 py-4">
                        {editingJob === job.id ? (
                          <select
                            defaultValue={job.status}
                            onChange={e => updateStatus(job, e.target.value)}
                            className="bg-ink-800 border border-ink-700 text-ink-100 text-xs rounded-lg px-2 py-1 outline-none"
                            autoFocus
                            onBlur={() => setEditingJob(null)}
                          >
                            {STATUSES.slice(1).map(s => (
                              <option key={s} value={s} className="capitalize">{s}</option>
                            ))}
                          </select>
                        ) : (
                          <button onClick={() => setEditingJob(job.id)} title="Click to change status">
                            <StatusBadge status={job.status} />
                          </button>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm font-mono text-ink-400">{job.date_applied}</td>
                      <td className="px-5 py-4 text-sm text-ink-400">{job.location || '—'}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => deleteJob(job.id)}
                          disabled={deletingId === job.id}
                          className="text-ink-500 hover:text-coral text-xs transition-colors opacity-0 group-hover:opacity-100"
                        >
                          {deletingId === job.id ? '…' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
