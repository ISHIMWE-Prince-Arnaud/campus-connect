

import { Toaster } from 'react-hot-toast';
import { useCallback, useEffect, useState, Link } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import api, { setAuthToken } from './api/client.js';
import { getStoredToken } from './api/client.js';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Feed from './pages/Feed.jsx';
import Quests from './pages/Quests.jsx';
import Chat  from './pages/Chat.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Admin from './pages/Admin.jsx';


function App({ socket }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }
    setAuthToken(token);
    api.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const authed = !!user;

  // Toast helpers
  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    setToasts(ts => [...ts, { id: Date.now() + Math.random(), message, type, duration }]);
  }, []);
  const removeToast = useCallback(id => {
    setToasts(ts => ts.filter(t => t.id !== id));
  }, []);

  // Example: show a toast on login
  // useEffect(() => {
  //   if (authed) showToast('Welcome back!', 'success');
  // }, [authed, showToast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={() => { setAuthToken(null); setUser(null); }} />
      <Toaster position="top-right" gutter={8} toastOptions={{
        className: 'card-elevated glass font-sans',
        duration: 3500,
        style: { fontSize: '1rem', borderRadius: '1rem', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }
      }} />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Navigate to={authed ? '/feed' : '/login'} />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/feed" element={authed ? <Feed socket={socket} user={user} /> : <Navigate to="/login" />} />
          <Route path="/leaderboard" element={authed ? <Leaderboard socket={socket} /> : <Navigate to="/login" />} />
          <Route path="/quests" element={authed ? <Quests user={user} /> : <Navigate to="/login" />} />
          <Route path="/chat/:chatId" element={authed ? <Chat socket={socket} /> : <Navigate to="/login" />} />
          <Route path="/admin" element={authed ? <Admin user={user} /> : <Navigate to="/login" />} />
          <Route path="*" element={<div className="p-8 text-center"><Link to="/" className="btn">Home</Link></div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;


