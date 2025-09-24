import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { io } from 'socket.io-client';
import App from './App.jsx';
import './index.css';
import { getStoredToken } from './api/client.js';

function Root() {
  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(getStoredToken());

  const s = useMemo(() => {
    const url = import.meta.env.VITE_SOCKET_URL;
    const instance = io(url, { autoConnect: false, auth: { token } });
    return instance;
  }, [token]);

  useEffect(() => {
    if (token) {
      s.auth = { token };
      s.connect();
      setSocket(s);
    } else {
      s.disconnect();
      setSocket(null);
    }
    return () => s.disconnect();
  }, [s, token]);

  useEffect(() => {
    const handler = (e) => setToken(e.detail?.token || null);
    window.addEventListener('cc-auth-changed', handler);
    return () => window.removeEventListener('cc-auth-changed', handler);
  }, []);

  return <App socket={socket} />;
}

createRoot(document.getElementById('root')).render(<Root />);


