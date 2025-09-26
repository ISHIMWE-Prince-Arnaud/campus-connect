import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/client.js';

function PostComposer({ onPosted }) {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const prompts = [
    "Share a thought or @mention someone...",
    "What's on your mind today?",
    "Ask a question or start a discussion...",
    "Post an update or a fun fact!",
    "Share something inspiring...",
    "What's happening around campus?",
    "Got advice or tips? Post here!"
  ];
  const [placeholder, setPlaceholder] = useState(() => prompts[Math.floor(Math.random() * prompts.length)]);

  // Change placeholder every minute
 useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder(prompts[Math.floor(Math.random() * prompts.length)]);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  async function submit() {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await api.post('/posts', { content, mediaUrl });
      setContent('');
      setMediaUrl('');
      onPosted && onPosted(res.data);
      toast.success('Post published!');
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to post');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card bg-base-100 shadow mb-4">
      <div className="card-body">
        <textarea className="textarea textarea-bordered w-full" placeholder={placeholder}
          value={content} onChange={e => setContent(e.target.value)} />
        <input className="input input-bordered w-full" placeholder="Optional image URL"
          value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} />
        <div className="card-actions justify-end">
          <button className={`btn btn-primary ${loading ? 'loading' : ''}`} onClick={submit}>Post</button>
        </div>
      </div>
    </div>
  );
}

export default PostComposer;