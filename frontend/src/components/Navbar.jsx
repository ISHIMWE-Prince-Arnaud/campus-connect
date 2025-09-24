import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const [theme, setTheme] = useState('cupcake');
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="navbar bg-base-100 shadow">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">Campus Connect</Link>
        <Link to="/feed" className={`btn btn-ghost ${location.pathname === '/feed' ? 'btn-active' : ''}`}>Feed</Link>
        <Link to="/leaderboard" className={`btn btn-ghost ${location.pathname === '/leaderboard' ? 'btn-active' : ''}`}>Leaderboard</Link>
        <Link to="/quests" className={`btn btn-ghost ${location.pathname === '/quests' ? 'btn-active' : ''}`}>Quests</Link>
        {user?.roles?.includes('admin') && <Link to="/admin" className={`btn btn-ghost ${location.pathname === '/admin' ? 'btn-active' : ''}`}>Admin</Link>}
      </div>
      <div className="flex-none gap-2">
        <div className="mr-4">{user ? <span className="badge badge-primary">Points: {user.points ?? 0}</span> : null}</div>
        <button className="btn btn-ghost" onClick={() => setTheme(theme === 'cupcake' ? 'dark' : 'cupcake')}>Theme</button>
        {user ? (
          <button className="btn btn-outline" onClick={onLogout}>Logout</button>
        ) : (
          <Link to="/login" className="btn btn-primary">Login</Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;


