import React, { useEffect, useState } from 'react';
import api from '../api/client.js';
import PostComposer from '../components/PostComposer.jsx';
import PostCard from '../components/PostCard.jsx';

function Feed({ socket, user }) {
  const [posts, setPosts] = useState([]);

  function load() {
    api.get('/posts').then(res => setPosts(res.data));
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
    <div>
      <PostComposer onPosted={onPosted} />
      <div>
        {posts.map(p => <PostCard key={p._id} post={p} onReacted={onReacted} />)}
      </div>
    </div>
  );
}

export default Feed;


