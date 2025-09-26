import { useState } from 'react';
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock, FiUserCheck } from 'react-icons/fi';
import api, { setAuthToken } from '../api/client.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '', displayName: '', gender: 'other' });
  const [showPassword, setShowPassword] = useState(false);
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
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FiUser /></span>
              <input className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary" placeholder="Username"
                value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
            </div>
            {isRegister && (
              <>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FiMail /></span>
                  <input className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary" placeholder="Email"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FiUserCheck /></span>
                  <input className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary" placeholder="Display name"
                    value={form.displayName} onChange={e => setForm({ ...form, displayName: e.target.value })} />
                </div>
                <select className="select select-bordered w-full focus:ring-2 focus:ring-primary" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                  <option value="male">male</option>
                  <option value="female">female</option>
                  <option value="other">other</option>
                </select>
              </>
            )}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FiLock /></span>
              <input
                className="input input-bordered w-full pl-10 pr-10 focus:ring-2 focus:ring-primary"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
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


