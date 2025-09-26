import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMoon, FaSun, FaBell } from 'react-icons/fa';

const themes = ['devcamp', 'light', 'system'];

function getSystemTheme() {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'devcamp';
  return 'light';
}

export function Navbar({ user, onLogout }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'devcamp');
  const location = useLocation();

  useEffect(() => {
    let applied = theme;
    if (theme === 'system') applied = getSystemTheme();
    document.documentElement.setAttribute('data-theme', applied);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <motion.nav
      className="navbar card-elevated glass sticky top-0 z-30 backdrop-blur-md border-b border-white/10"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .35, ease: [0.18,0.67,0.6,1.22] }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex-1 items-center">
        <Link to="/" className="btn btn-ghost text-2xl font-display grad-text tracking-tight drop-shadow glow-primary flex items-center gap-2">
          Campus Connect
          <span className="badge badge-grad ml-2">beta</span>
        </Link>
  <Link to="/feed" className={`btn btn-ghost ${location.pathname === '/feed' ? 'btn-active' : ''}`}>Feed</Link>
  <Link to="/leaderboard" className={`btn btn-ghost ${location.pathname === '/leaderboard' ? 'btn-active' : ''}`}>Leaderboard</Link>
  <Link to="/quests" className={`btn btn-ghost ${location.pathname === '/quests' ? 'btn-active' : ''}`}>Quests</Link>
  {/* Remove Profile button, show avatar in top right */}
  {user?.roles?.includes('admin') && <Link to="/admin" className={`btn btn-ghost ${location.pathname === '/admin' ? 'btn-active' : ''}`}>Admin</Link>}
      </div>
      <div className="flex-none gap-3 items-center">
        <button
          className="btn btn-ghost"
          aria-label="Notifications"
          tabIndex={0}
        >
          <FaBell className="text-xl" />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          {user ? (
            <span className="badge badge-grad font-mono text-sm px-3 py-1">Points: {user.points ?? 0}</span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              {theme === 'devcamp' ? <FaMoon className="text-lg" /> : theme === 'light' ? <FaSun className="text-lg" /> : <FaMoon className="text-lg opacity-70" />}
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-36">
              <li><button onClick={() => setTheme('devcamp')}>Dark</button></li>
              <li><button onClick={() => setTheme('light')}>Light</button></li>
              <li><button onClick={() => setTheme('system')}>System</button></li>
            </ul>
          </div>
          {user && (
            <Link to="/profile" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 h-10 rounded-full overflow-hidden border">
                <img
                  src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.displayName || user.username}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          )}
        </div>
        {user ? (
          <motion.button
            className="btn btn-outline"
            onClick={onLogout}
            whileTap={{ scale: .92 }}
            whileHover={{ scale: 1.03 }}
          >Logout</motion.button>
        ) : (
          <Link to="/login" className="btn btn-primary">Login</Link>
        )}
      </div>
    </motion.nav>
  );
}

export default Navbar;


