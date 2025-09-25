import { useState } from 'react';
import api, { setAuthToken } from '../api/client.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '', displayName: '', gender: 'other' });
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const url = isRegister ? '/auth/register' : '/auth/login';
      const body = isRegister ? form : { username: form.username, password: form.password };
      const res = await api.post(url, body);
      setAuthToken(res.data.token);
      onLogin && onLogin(res.data.user);
      navigate('/feed');
      toast.success(isRegister ? 'Registration successful!' : 'Login successful!');
    } catch (e) {
      toast.error(e.response?.data?.error || 'Auth failed');
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="card bg-base-100 w-full max-w-md shadow">
        <div className="card-body">
          <h2 className="card-title">{isRegister ? 'Register' : 'Login'}</h2>
          <form className="space-y-2" onSubmit={submit}>
            <input className="input input-bordered w-full" placeholder="Username"
              value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
            {isRegister && (
              <>
                <input className="input input-bordered w-full" placeholder="Email"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                <input className="input input-bordered w-full" placeholder="Display name"
                  value={form.displayName} onChange={e => setForm({ ...form, displayName: e.target.value })} />
                <select className="select select-bordered w-full" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                  <option value="male">male</option>
                  <option value="female">female</option>
                  <option value="other">other</option>
                </select>
              </>
            )}
            <input className="input input-bordered w-full" placeholder="Password" type="password"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            <div className="card-actions justify-between pt-2">
              <button type="button" className="btn btn-ghost" onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? 'Have an account? Login' : 'Create an account'}
              </button>
              <button className="btn btn-primary" type="submit">{isRegister ? 'Register' : 'Login'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;


