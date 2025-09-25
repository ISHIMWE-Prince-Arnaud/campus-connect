import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem('token', token);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cc-auth-changed', { detail: { token } }));
    }
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem('token');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cc-auth-changed', { detail: { token: null } }));
    }
  }
}

export function getStoredToken() {
  return localStorage.getItem('token');
}

export default api;