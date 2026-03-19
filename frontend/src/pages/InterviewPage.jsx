import React, { useState } from 'react';
import api from '../utils/api';

const QUICK_ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer',
  'Data Scientist', 'Data Analyst', 'Product Manager',
  'UX Designer', 'Marketing Manager', 'Financial Analyst',
];

export default function InterviewPage() {
  const [role, setRole] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState({});
  const [answers, setAnswers] = useState({});

  const generate = async (r) => {
    const target = r || role;
    if (!target.trim()) { setError('Please enter a job role.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    setRevealed({});
    setAnswers({});
    try {
      const { data } = await api.post('/jobs/interview-questions/', { role: target });
      setResult(data);
      if (r) setRole(r);
    } catch {
      setError('Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleReveal = (id) => setRevealed(prev => ({ ...prev, [id]: !prev[id] }));
  const updateAnswer = (id, val) => setAnswers(prev => ({ ...prev, [id]: val }));

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-50">Interview Prep</h1>
        <p className="text-ink-400 text-sm mt-1">Get role-specific questions to practice with</p>
      </div>

      {/* Input */}
      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-300 mb-1.5">Job Role</label>
          <div className="flex gap-2">
            <input
              value={role}
              onChange={e => setRole(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generate()}
              placeholder="e.g. Software Engineer, Product Manager…"
              className="input-field flex-1"
            />
            <button onClick={() => generate()} disabled={loading} className="btn-primary whitespace-nowrap flex items-center gap-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating…</>
                : '◎ Generate'
              }
            </button>
          </div>
        </div>

        {/* Quick roles */}
        <div>
          <p className="text-xs text-ink-500 mb-2 font-medium">Quick select:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_ROLES.map(r => (
              <button
                key={r}
                onClick={() => generate(r)}
                className="text-xs px-3 py-1.5 rounded-lg glass glass-hover text-ink-300 hover:text-electric-400 transition-colors"
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}
      </div>

      {/* Questions */}
      {result && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-ink-100">
              Questions for <span className="text-electric-400">{result.role}</span>
            </h2>
            <span className="text-xs text-ink-500 font-mono capitalize bg-ink-800/60 px-2 py-1 rounded-lg">
              {result.category}
            </span>
          </div>

          {/* STAR tip */}
          <div className="flex items-start gap-3 bg-electric-600/10 border border-electric-500/20 rounded-xl px-4 py-3">
            <span className="text-electric-400 text-lg mt-0.5">💡</span>
            <p className="text-sm text-electric-300">{result.tip}</p>
          </div>

          <div className="space-y-3">
            {result.questions.map((q) => (
              <div key={q.id} className="card glass-hover space-y-3">
                <div className="flex items-start gap-3">
                  <span className="font-display font-bold text-electric-500 text-sm shrink-0 mt-0.5 w-5">
                    {q.id}.
                  </span>
                  <p className="text-sm text-ink-100 font-medium leading-relaxed flex-1">{q.question}</p>
                  <button
                    onClick={() => toggleReveal(q.id)}
                    className="text-xs text-ink-500 hover:text-electric-400 transition-colors shrink-0 font-mono"
                  >
                    {revealed[q.id] ? '▲ hide' : '▼ practice'}
                  </button>
                </div>

                {revealed[q.id] && (
                  <div className="ml-8 animate-slide-up">
                    <label className="block text-xs text-ink-400 mb-1.5 font-medium">Your answer (practice):</label>
                    <textarea
                      value={answers[q.id] || ''}
                      onChange={e => updateAnswer(q.id, e.target.value)}
                      rows={4}
                      placeholder="Write your STAR answer here…"
                      className="input-field resize-none text-sm"
                    />
                    {answers[q.id] && (
                      <p className="text-xs text-ink-500 mt-1 font-mono">
                        {answers[q.id].split(/\s+/).filter(Boolean).length} words
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => generate(role)}
            className="btn-secondary text-sm w-full flex justify-center items-center gap-2"
          >
            ↻ Regenerate Questions
          </button>
        </div>
      )}
    </div>
  );
}
