import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/client.js';

function PostComposer({ onPosted }) {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [imageSource, setImageSource] = useState('url'); // 'url' or 'upload'
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
    let finalMediaUrl = '';
    try {
      if (imageSource === 'upload' && file) {
        const formData = new FormData();
        formData.append('image', file);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalMediaUrl = uploadRes.data.url;
      } else if (imageSource === 'url' && mediaUrl) {
        finalMediaUrl = mediaUrl;
      }
      const res = await api.post('/posts', { content, mediaUrl: finalMediaUrl });
      setContent('');
      setMediaUrl('');
      setFile(null);
      setImageSource('url');
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
        <div className="mb-2 flex gap-4 items-center">
          <label className="flex items-center gap-2">
            <input type="radio" name="imageSource" value="url" checked={imageSource === 'url'} onChange={() => setImageSource('url')} />
            <span>Image URL</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="imageSource" value="upload" checked={imageSource === 'upload'} onChange={() => setImageSource('upload')} />
            <span>Upload Image</span>
          </label>
        </div>
        {imageSource === 'url' ? (
          <input className="input input-bordered w-full mb-2" placeholder="Optional image URL"
            value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} />
        ) : (
          <input type="file" accept="image/*" className="file-input file-input-bordered w-full mb-2"
            onChange={e => setFile(e.target.files[0])} />
        )}
        <div className="card-actions justify-end">
          <button className={`btn btn-primary ${loading ? 'loading' : ''}`} onClick={submit}>Post</button>
        </div>
      </div>
    </div>
  );
}

export default PostComposer;