import React, { useEffect, useState } from 'react';
import api from '../api/client.js';

function Admin({ user }) {
  const [reports, setReports] = useState([]);

  async function load() {
    try {
      const res = await api.get('/admin/reports');
      setReports(res.data);
    } catch {
      setReports([]);
    }
  }
  useEffect(() => { load(); }, []);

  async function removePost(id) {
    await api.post(`/admin/posts/${id}/remove`);
    load();
  }

  async function restorePost(id) {
    await api.post(`/admin/posts/${id}/restore`);
    load();
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Reports</h2>
      {reports.map(r => (
        <div key={r._id} className="card bg-base-100 shadow mb-2">
          <div className="card-body">
            <div className="font-semibold">Post #{r.targetId}</div>
            <div className="opacity-70">Reason: {r.reason}</div>
            <div className="card-actions justify-end">
              <button className="btn btn-error btn-sm" onClick={() => removePost(r.targetId)}>Remove</button>
              <button className="btn btn-ghost btn-sm" onClick={() => restorePost(r.targetId)}>Restore</button>
            </div>
          </div>
        </div>
      ))}
      {reports.length === 0 ? <div className="alert">No open reports.</div> : null}
    </div>
  );
}

export default Admin;


