import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/client.js';
import { FaCrown, FaMedal } from 'react-icons/fa';

function Leaderboard({ socket }) {
  const [top, setTop] = useState([]);

  async function load() {
    const res = await api.get('/leaderboard/weekly');
    setTop(res.data);
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!socket) return;
    const handler = () => load();
    socket.on('leaderboard:updated', handler);
    return () => socket.off('leaderboard:updated', handler);
  }, [socket]);

  return (
    <div className="max-w-2xl mx-auto">
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold mb-4">Weekly Leaderboard</motion.h2>
      <ol>
        {top.map((u, idx) => (
          <motion.li key={u._id || idx} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.06 }} className="card bg-base-100 shadow mb-2">
            <div className="card-body flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-xl">{idx === 0 ? <FaCrown className="text-yellow-500" /> : <FaMedal className={idx===1?'text-gray-400':idx===2?'text-amber-700':'text-base-content'} />}</div>
                <div className="font-semibold">{u.displayName || u.username}</div>
              </div>
              <div className="badge badge-primary badge-lg">{u.points} pts</div>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export default Leaderboard;


