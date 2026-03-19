import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RadialBarChart, RadialBar, Cell,
  PieChart, Pie, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const STAT_CARDS = [
  { key: 'total',     label: 'Total',     color: '#8b5cf6', bg: 'from-electric-600/20 to-electric-600/5' },
  { key: 'applied',   label: 'Applied',   color: '#60a5fa', bg: 'from-blue-500/20 to-blue-500/5' },
  { key: 'interview', label: 'Interview', color: '#fbbf24', bg: 'from-amber-500/20 to-amber-500/5' },
  { key: 'offer',     label: 'Offers',    color: '#a3e635', bg: 'from-lime-500/20 to-lime-500/5' },
  { key: 'selected',  label: 'Selected',  color: '#34d399', bg: 'from-green-500/20 to-green-500/5' },
  { key: 'rejected',  label: 'Rejected',  color: '#f87171', bg: 'from-red-500/20 to-red-500/5' },
];

const PIE_COLORS = ['#60a5fa', '#fbbf24', '#a3e635', '#34d399', '#f87171', '#94a3b8'];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs/dashboard/')
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard…" />;

  const pieData = STAT_CARDS.slice(1).map((s, i) => ({
    name: s.label,
    value: stats?.[s.key] || 0,
    color: PIE_COLORS[i],
  })).filter(d => d.value > 0);

  const successRate = stats?.total
    ? Math.round(((stats.offer + stats.selected) / stats.total) * 100)
    : 0;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-50">
            Hello, {user?.first_name || user?.username} 👋
          </h1>
          <p className="text-ink-400 text-sm mt-1">Here's your job search overview</p>
        </div>
        <Link to="/add-job" className="btn-primary text-sm">
          + Add Application
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {STAT_CARDS.map(({ key, label, color, bg }) => (
          <div key={key} className={`card bg-gradient-to-b ${bg} border-ink-800/40 group hover:scale-105 transition-transform duration-200`}>
            <p className="text-2xl font-display font-bold glow-text" style={{ color }}>
              {stats?.[key] ?? 0}
            </p>
            <p className="text-ink-400 text-xs mt-1 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts + Success Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pie Chart */}
        <div className="card lg:col-span-2">
          <h2 className="font-display font-semibold text-ink-100 mb-4">Application Breakdown</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1e1e3d',
                    border: '1px solid #3c3c6b',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#e0e0eb',
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ color: '#9494ba', fontSize: '12px' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-ink-500">
              <span className="text-4xl mb-3">◈</span>
              <p className="text-sm">No data yet. Add your first application!</p>
            </div>
          )}
        </div>

        {/* Success Rate Radial */}
        <div className="card flex flex-col items-center justify-center">
          <h2 className="font-display font-semibold text-ink-100 mb-2 self-start">Success Rate</h2>
          <p className="text-ink-400 text-xs self-start mb-4">(Offers + Selected)</p>
          <div className="relative">
            <RadialBarChart
              width={160}
              height={160}
              cx={80}
              cy={80}
              innerRadius={55}
              outerRadius={75}
              startAngle={90}
              endAngle={-270}
              data={[{ value: successRate }]}
            >
              <RadialBar background={{ fill: '#1e1e3d' }} dataKey="value" cornerRadius={8}>
                <Cell fill="#8b5cf6" />
              </RadialBar>
            </RadialBarChart>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-2xl font-bold text-electric-400 glow-text">
                {successRate}%
              </span>
            </div>
          </div>
          <p className="text-ink-400 text-xs mt-3 text-center">
            {stats?.total ? `${stats.offer + stats.selected} of ${stats.total} apps` : 'Add applications to track'}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-ink-100">Recent Applications</h2>
          <Link to="/jobs" className="text-electric-400 hover:text-electric-300 text-sm transition-colors">
            View all →
          </Link>
        </div>
        {stats?.recent?.length > 0 ? (
          <div className="divide-y divide-ink-800/50">
            {stats.recent.map((job) => (
              <div key={job.id} className="flex items-center justify-between py-3 group">
                <div>
                  <p className="text-sm font-medium text-ink-100 group-hover:text-electric-400 transition-colors">
                    {job.role}
                  </p>
                  <p className="text-xs text-ink-400 mt-0.5">{job.company}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-500 font-mono">{job.date_applied}</span>
                  <StatusBadge status={job.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-ink-500">
            <p className="text-sm">No applications yet.</p>
            <Link to="/add-job" className="text-electric-400 text-sm hover:text-electric-300 mt-1 inline-block">
              Add your first one →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
