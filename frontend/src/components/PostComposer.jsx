import { useState } from 'react';
import api from '../api/client.js';

function PostComposer({ onPosted }) {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await api.post('/posts', { content, mediaUrl });
      setContent('');
      setMediaUrl('');
      onPosted && onPosted(res.data);
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to post');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card bg-base-100 shadow mb-4">
      <div className="card-body">
        <textarea className="textarea textarea-bordered w-full" placeholder="Share a thought or @mention someone..."
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