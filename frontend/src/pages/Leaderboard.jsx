
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/client.js';
import { FaCrown, FaMedal } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

function Leaderboard({ socket }) {
  const [top, setTop] = useState([]);

  async function load() {
    try {
      const res = await api.get('/leaderboard/weekly');
      setTop(res.data);
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to load leaderboard');
    }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!socket) return;
    const handler = () => load();
    socket.on('leaderboard:updated', handler);
    return () => socket.off('leaderboard:updated', handler);
  }, [socket]);

  return (
    <motion.div
      className="max-w-3xl mx-auto py-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .35, ease: [0.18,0.67,0.6,1.22] }}
    >
      <h2 className="font-display grad-text text-3xl font-bold mb-8 text-center drop-shadow">Weekly Leaderboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {top.slice(0, 3).map((u, idx) => (
          <motion.div
            key={u._id || idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .4, delay: idx * 0.08 }}
            className={`card-elevated glass p-6 flex flex-col items-center justify-center border-2 ${idx === 0 ? 'border-gradient-to-r from-primary to-accent shadow-glow-primary' : 'border-gradient-to-r from-secondary to-primary'} rounded-xl relative`}
            style={{ boxShadow: idx === 0 ? '0 0 40px -10px rgba(99,102,241,0.55)' : undefined }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              {idx === 0 ? <FaCrown className="text-5xl text-yellow-400 drop-shadow" /> : <FaMedal className="text-4xl text-fuchsia-400 drop-shadow" />}
            </div>
            <div className="font-display text-xl grad-text mb-2 text-center">{u.displayName || u.username}</div>
            <div className="badge badge-grad font-mono text-lg px-4 py-2 mb-2">{u.points} pts</div>
            <div className="text-xs text-base-content/60">#{idx + 1}</div>
          </motion.div>
        ))}
      </div>
      <motion.ol
        className="mt-2"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: .04 } } }}
      >
        {top.slice(3).map((u, idx) => (
          <motion.li
            key={u._id || idx}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-elevated glass mb-2 px-4 py-3 flex flex-row items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <FaMedal className="text-base-content/40" />
              <span className="font-semibold">{u.displayName || u.username}</span>
            </div>
            <span className="font-mono badge badge-grad px-3 py-1">{u.points} pts</span>
            <span className="text-xs text-base-content/60">#{idx + 4}</span>
          </motion.li>
        ))}
      </motion.ol>
    </motion.div>
  );
}

export default Leaderboard;


