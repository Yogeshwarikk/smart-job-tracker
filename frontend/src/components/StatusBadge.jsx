import React from 'react';

const CONFIG = {
  applied:   { bg: 'bg-blue-500/15',   text: 'text-blue-400',   dot: 'bg-blue-400',   label: 'Applied' },
  interview: { bg: 'bg-amber-500/15',  text: 'text-amber-400',  dot: 'bg-amber-400',  label: 'Interview' },
  offer:     { bg: 'bg-lime-500/15',   text: 'text-lime-400',   dot: 'bg-lime-400',   label: 'Offer' },
  selected:  { bg: 'bg-green-500/15',  text: 'text-green-400',  dot: 'bg-green-400',  label: 'Selected' },
  rejected:  { bg: 'bg-red-500/15',    text: 'text-red-400',    dot: 'bg-red-400',    label: 'Rejected' },
  withdrawn: { bg: 'bg-ink-500/20',    text: 'text-ink-400',    dot: 'bg-ink-400',    label: 'Withdrawn' },
};

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status] || CONFIG.applied;
  return (
    <span className={`status-badge ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
