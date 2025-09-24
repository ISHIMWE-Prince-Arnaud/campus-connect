import React from 'react';
import { motion } from 'framer-motion';
import { FaLaugh, FaFire, FaThumbsUp } from 'react-icons/fa';
import { MdBedroomBaby } from 'react-icons/md';
import api from '../api/client.js';

function PostCard({ post, onReacted }) {
  const counts = post.reactionCounts || { like: 0, laugh: 0, fire: 0, relatable: 0 };

  async function react(type) {
    try {
      const res = await api.post(`/posts/${post._id}/react`, { type });
      onReacted && onReacted(post._id, res.data.reactionCounts);
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to react');
    }
  }

  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card bg-base-100 shadow mb-3">
      <div className="card-body">
        <div className="flex items-center gap-2">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-8">
              <span>{post.author?.displayName?.[0] || '?'}</span>
            </div>
          </div>
          <div className="font-semibold">{post.author?.displayName || post.author?.username}</div>
          <div className="badge">{new Date(post.createdAt).toLocaleString()}</div>
        </div>
        <div className="mt-2 whitespace-pre-wrap">{post.content}</div>
        {post.mediaUrl ? <img src={post.mediaUrl} alt="" className="rounded mt-2 max-h-80 object-contain" /> : null}
        <div className="flex gap-3 mt-3">
          <button className="btn btn-sm" onClick={() => react('like')}><FaThumbsUp /> {counts.like}</button>
          <button className="btn btn-sm" onClick={() => react('laugh')}><FaLaugh /> {counts.laugh}</button>
          <button className="btn btn-sm" onClick={() => react('fire')}><FaFire /> {counts.fire}</button>
          <button className="btn btn-sm" onClick={() => react('relatable')}><MdBedroomBaby /> {counts.relatable}</button>
        </div>
      </div>
    </motion.div>
  );
}

export default PostCard;


