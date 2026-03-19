import React, { useState } from 'react';
import api from '../utils/api';

const SEVERITY_COLOR = {
  high:   { bar: 'bg-red-400',    text: 'text-red-400',    badge: 'bg-red-500/15 text-red-400' },
  medium: { bar: 'bg-amber-400',  text: 'text-amber-400',  badge: 'bg-amber-500/15 text-amber-400' },
  low:    { bar: 'bg-blue-400',   text: 'text-blue-400',   badge: 'bg-blue-500/15 text-blue-400' },
};

function ScoreBar({ score, color }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-ink-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-mono text-ink-400 w-8 text-right">{score}</span>
    </div>
  );
}

export default function ResumePage() {
  const [role, setRole] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!resumeText.trim()) { setError('Please paste your resume text.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post('/jobs/resume-feedback/', { resume_text: resumeText, role });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = result
    ? result.overall_score >= 75 ? '#34d399' : result.overall_score >= 50 ? '#fbbf24' : '#f87171'
    : '#8b5cf6';

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-50">Resume AI Feedback</h1>
        <p className="text-ink-400 text-sm mt-1">Paste your resume and get instant AI-powered suggestions</p>
      </div>

      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-300 mb-1.5">
            Target Role <span className="text-ink-500">(optional)</span>
          </label>
          <input
            value={role}
            onChange={e => setRole(e.target.value)}
            placeholder="e.g. Software Engineer, Data Analyst…"
            className="input-field max-w-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-300 mb-1.5">
            Resume Text <span className="text-red-400">*</span>
          </label>
          <textarea
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
            rows={10}
            placeholder="Paste the full text of your resume here…

Example:
John Doe | Software Engineer | john@example.com

EXPERIENCE
Senior Developer at Acme Corp (2021–2024)
• Led backend team of 5 engineers
• Reduced API response time by 35%
..."
            className="input-field resize-none font-mono text-sm"
          />
          <p className="text-xs text-ink-500 mt-1">{resumeText.split(/\s+/).filter(Boolean).length} words</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button onClick={analyze} disabled={loading} className="btn-primary flex items-center gap-2">
          {loading
            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing…</>
            : '◉ Analyze Resume'
          }
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-slide-up">
          {/* Score header */}
          <div className="card flex items-center gap-6">
            <div className="relative w-24 h-24 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e1e3d" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke={scoreColor} strokeWidth="3"
                  strokeDasharray={`${result.overall_score} 100`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-xl font-bold" style={{ color: scoreColor }}>
                  {result.overall_score}
                </span>
              </div>
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-ink-50">Overall Score</h2>
              <p className="text-ink-400 text-sm mt-1">{result.summary}</p>
              <p className="text-ink-500 text-xs mt-2 font-mono">{result.word_count} words · Role: {result.role_analyzed || 'General'}</p>
            </div>
          </div>

          {/* Tip cards */}
          <div className="space-y-3">
            <h3 className="font-display font-semibold text-ink-200 text-sm uppercase tracking-wider">Detailed Feedback</h3>
            {result.tips.map((tip, i) => {
              const cfg = SEVERITY_COLOR[tip.severity] || SEVERITY_COLOR.low;
              return (
                <div key={i} className="card glass-hover space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold text-ink-100 text-sm">{tip.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
                        {tip.severity}
                      </span>
                    </div>
                    <span className={`font-mono text-sm font-bold ${cfg.text}`}>{tip.score}/100</span>
                  </div>
                  <ScoreBar score={tip.score} color={cfg.bar} />
                  <p className="text-sm text-ink-300 leading-relaxed">{tip.feedback}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
