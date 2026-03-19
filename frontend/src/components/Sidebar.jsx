import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/dashboard', icon: '▦', label: 'Dashboard' },
  { to: '/jobs',      icon: '◈', label: 'Applications' },
  { to: '/add-job',   icon: '⊕', label: 'Add Job' },
  { to: '/resume',    icon: '◉', label: 'Resume AI' },
  { to: '/interview', icon: '◎', label: 'Interview Prep' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className={`flex flex-col h-screen sticky top-0 glass border-r border-ink-800/50 transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-ink-800/50">
        <div className="w-8 h-8 rounded-lg bg-electric-600 flex items-center justify-center shrink-0 text-sm font-bold shadow-lg shadow-electric-600/30">
          SJ
        </div>
        {!collapsed && (
          <span className="font-display font-bold text-sm tracking-wide text-ink-100 whitespace-nowrap">
            Job Tracker
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {NAV.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
               ${isActive
                 ? 'bg-electric-600/20 text-electric-400 border border-electric-500/20'
                 : 'text-ink-300 hover:text-ink-100 hover:bg-ink-800/50'
               }`
            }
          >
            <span className="text-base shrink-0 w-5 text-center">{icon}</span>
            {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + Collapse */}
      <div className="border-t border-ink-800/50 p-3 space-y-2">
        {!collapsed && user && (
          <div className="px-2 py-2">
            <p className="text-xs font-medium text-ink-100 truncate">{user.username}</p>
            <p className="text-xs text-ink-400 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-ink-400 hover:text-coral hover:bg-red-500/10 transition-all duration-200 text-sm"
        >
          <span className="shrink-0 w-5 text-center">⏻</span>
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-ink-500 hover:text-ink-300 hover:bg-ink-800/40 transition-all duration-200 text-sm"
        >
          <span className="shrink-0 w-5 text-center">{collapsed ? '»' : '«'}</span>
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
