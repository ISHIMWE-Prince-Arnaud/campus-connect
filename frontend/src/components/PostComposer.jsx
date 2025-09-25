
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import api from '../api/client.js';
import { toast } from 'react-hot-toast';

const MAX_LENGTH = 500;
const prompts = [
  'What bug beat you today?',
  'Share a meme-worthy dev moment...',
  'What did you learn this week?',
  'Who deserves a shoutout?'
];

function PostComposer({ onPosted }) {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [prompt] = useState(() => prompts[Math.floor(Math.random() * prompts.length)]);
  const textareaRef = useRef();

  async function submit(e) {
    if (e) e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await api.post('/posts', { content, mediaUrl });
      setContent('');
      setMediaUrl('');
      onPosted && onPosted(res.data);
      toast.success('Post submitted!');
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to post');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      submit(e);
    }
  }

  return (
    <motion.form
      className="card-elevated glass mb-6 p-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .35, ease: [0.18,0.67,0.6,1.22] }}
      onSubmit={submit}
    >
      <div className="mb-2">
        <textarea
          ref={textareaRef}
          className="textarea textarea-bordered w-full font-sans text-base rounded-xl focus-visible"
          placeholder={prompt}
          value={content}
          maxLength={MAX_LENGTH}
          onChange={e => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          aria-label="Post content"
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-base-content/60 font-mono">{content.length}/{MAX_LENGTH}</span>
          <span className="text-xs text-base-content/60">Ctrl+Enter to post</span>
        </div>
      </div>
      <input
        className="input input-bordered w-full font-mono text-sm rounded-xl mb-2"
        placeholder="Optional image URL (jpg, png, gif...)"
        value={mediaUrl}
        onChange={e => setMediaUrl(e.target.value)}
        aria-label="Image URL"
      />
      <div className="flex justify-end items-center gap-2 mt-2">
        <motion.button
          type="submit"
          className={`btn grad-text font-semibold px-6 py-2 rounded-xl shadow-glow-primary ${loading ? 'loading' : ''}`}
          whileTap={{ scale: .92 }}
          whileHover={{ scale: 1.03 }}
          disabled={loading || !content.trim()}
        >Post</motion.button>
      </div>
    </motion.form>
  );
}

export default PostComposer;


