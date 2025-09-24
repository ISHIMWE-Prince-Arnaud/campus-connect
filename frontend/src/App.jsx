import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Feed from './pages/Feed.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Quests from './pages/Quests.jsx';
import Chat from './pages/Chat.jsx';
import Admin from './pages/Admin.jsx';
import api, { getStoredToken, setAuthToken } from './api/client.js';

function App({ socket }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;
    setAuthToken(token);
    api.get('/auth/me').then(res => setUser(res.data)).catch(() => setUser(null));
  }, []);

  const authed = !!user;

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={() => { setAuthToken(null); setUser(null); }} />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Navigate to={authed ? '/feed' : '/login'} />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/feed" element={authed ? <Feed socket={socket} user={user} /> : <Navigate to="/login" />} />
          <Route path="/leaderboard" element={<Leaderboard socket={socket} />} />
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


