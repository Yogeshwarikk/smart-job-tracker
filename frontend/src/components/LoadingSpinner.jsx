import React from 'react';

export default function LoadingSpinner({ text = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-ink-700 border-t-electric-500 animate-spin" />
      <p className="text-ink-400 text-sm">{text}</p>
    </div>
  );
}
