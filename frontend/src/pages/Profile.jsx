import { useState, useEffect } from 'react';
import api from '../api/client.js';
import { FiUser, FiUserCheck, FiLock, FiImage, FiMail } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

function Profile() {
  const [form, setForm] = useState({ username: '', displayName: '', password: '', avatarUrl: '', gender: 'other', email: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await api.get('/profile/me');
        setForm({ ...form, ...res.data, password: '' });
        setAvatarPreview(res.data.avatarUrl || '');
      } catch (e) {
        toast.error('Failed to load profile');
      }
      setLoading(false);
    }
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      let avatarUrl = form.avatarUrl;
      if (avatarFile) {
        const data = new FormData();
        data.append('image', avatarFile);
        const res = await api.post('/upload', data);
        avatarUrl = res.data.url;
      }
      const body = { ...form, avatarUrl };
      if (!body.password) delete body.password;
      const res = await api.put('/profile/me', body);
      setForm({ ...form, ...res.data, password: '' });
      setAvatarPreview(res.data.avatarUrl || '');
      toast.success('Profile updated!');
    } catch (e) {
      toast.error(e.response?.data?.error || 'Update failed');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="card bg-base-100 w-full max-w-md shadow">
        <div className="card-body">
          <h2 className="card-title">Edit Profile</h2>
          <form className="space-y-2" onSubmit={submit}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FiUser /></span>
              <input className="input input-bordered w-full pl-10" placeholder="Username"
                value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FiUserCheck /></span>
              <input className="input input-bordered w-full pl-10" placeholder="Display name"
                value={form.displayName} onChange={e => setForm({ ...form, displayName: e.target.value })} />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FiMail /></span>
              <input className="input input-bordered w-full pl-10" placeholder="Email" type="email"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FiLock /></span>
              <input className="input input-bordered w-full pl-10" placeholder="New password" type="password"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="relative flex items-center gap-2 mt-2 justify-center">
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-[85%]"
                onChange={e => {
                  const file = e.target.files[0];
                  setAvatarFile(file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = ev => setAvatarPreview(ev.target.result);
                    reader.readAsDataURL(file);
                  } else {
                    setAvatarPreview(form.avatarUrl || '');
                  }
                }}
              />
              {avatarPreview && (
                <img src={avatarPreview} alt="Avatar preview" className="w-10 h-10 rounded-full object-cover border ml-2" />
              )}
            </div>
            <div className="card-actions justify-end pt-2">
              <button className="btn btn-primary" type="submit" disabled={loading}>Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
