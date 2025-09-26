import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/client.js';

function PostComposer({ onPosted }) {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
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
    let finalMediaUrls = [];
    try {
      if (imageSource === 'upload' && files.length > 0) {
        for (const file of files) {
          const formData = new FormData();
          formData.append('image', file);
          const uploadRes = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          finalMediaUrls.push(uploadRes.data.url);
        }
      } else if (imageSource === 'url' && mediaUrl) {
        finalMediaUrls = [mediaUrl];
      }
      const res = await api.post('/posts', { content, mediaUrls: finalMediaUrls });
      setContent('');
      setMediaUrl('');
      setFiles([]);
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
          <input
            className="input input-bordered w-full mb-2"
            placeholder="Optional image URL"
            value={mediaUrl}
            onChange={e => setMediaUrl(e.target.value)}
          />
        ) : (
          <>
            <div className="mb-2">
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={e => setFiles(Array.from(e.target.files))}
              />
              <label htmlFor="file-upload" className="btn btn-primary btn-sm cursor-pointer flex items-center gap-2">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><polyline points="16 10 12 6 8 10"/><line x1="12" y1="6" x2="12" y2="18"/></svg>
                Choose Image
              </label>
            </div>
            {files.length > 0 && (
              <div className="mb-2 flex gap-2 flex-wrap p-2 bg-base-200 rounded-lg border border-base-300 items-center justify-center">
                {files.map((file, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${idx + 1}`}
                      className="rounded-lg shadow border border-base-300 object-cover"
                      style={{ width: '100px', height: '100px' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        <div className="card-actions justify-end">
          <button className={`btn btn-primary ${loading ? 'loading' : ''}`} onClick={submit}>Post</button>
        </div>
      </div>
    </div>
  );
}

export default PostComposer;