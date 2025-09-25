
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/client.js';
import PostComposer from '../components/PostComposer.jsx';
import PostCard from '../components/PostCard.jsx';
import { toast } from 'react-hot-toast';

function Feed({ socket, user }) {
  const [posts, setPosts] = useState([]);

  function load() {
    api.get('/posts')
      .then(res => setPosts(res.data))
      .catch(e => toast.error(e.response?.data?.error || 'Failed to load posts'));
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!socket) return;
    const handler = (payload) => {
      setPosts((ps) => ps.map(p => p._id === payload.postId ? { ...p, reactionCounts: payload.reactionCounts } : p));
    };
    socket.on('post:reacted', handler);
    return () => socket.off('post:reacted', handler);
  }, [socket]);

  function onPosted(post) {
    setPosts((ps) => [post, ...ps]);
  }

  function onReacted(id, counts) {
    setPosts((ps) => ps.map(p => p._id === id ? { ...p, reactionCounts: counts } : p));
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .35, ease: [0.18,0.67,0.6,1.22] }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left sidebar */}
        <aside className="hidden lg:block">
          <div className="card-elevated glass p-4 mb-6">
            <div className="font-display text-xl grad-text mb-2">Welcome, {user?.displayName || user?.username || 'dev'}!</div>
            <div className="font-mono text-base-content/80 mb-2">Points: <span className="font-bold">{user?.points ?? 0}</span></div>
            <div className="font-mono text-base-content/80 mb-2">Streak: <span className="font-bold">{user?.streak ?? 0}</span></div>
            {/* Mini leaderboard widget stub */}
            <div className="mt-4">
              <div className="font-bold text-base mb-2">Mini Leaderboard</div>
              <div className="skeleton h-8 w-full mb-2" />
              <div className="skeleton h-8 w-2/3" />
            </div>
          </div>
        </aside>
        {/* Main feed */}
        <main className="col-span-1 lg:col-span-1">
          <PostComposer onPosted={onPosted} />
          <div>
            {posts.length === 0 ? (
              <div className="card-elevated glass p-6 text-center text-base-content/70 animate-pulse">No posts yet. Be the first to share a thought!</div>
            ) : (
              posts.map(p => <PostCard key={p._id} post={p} onReacted={onReacted} />)
            )}
          </div>
        </main>
        {/* Right sidebar */}
        <aside className="hidden lg:block">
          <div className="card-elevated glass p-4 mb-6">
            <div className="font-bold grad-text text-lg mb-2">Weekly Quest</div>
            <div className="text-base-content/80 mb-2" title="Complete this quest with your pair for bonus points!">Co-create a meme about coding!</div>
            <div className="skeleton h-8 w-full mb-2" />
            <div className="font-bold text-base mt-4 mb-2">Trending Posts</div>
            <div className="skeleton h-8 w-full mb-2" />
            <div className="skeleton h-8 w-2/3" />
          </div>
        </aside>
      </div>
    </motion.div>
  );
}

export default Feed;


