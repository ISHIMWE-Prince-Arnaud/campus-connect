import React, { useState } from 'react';
import api from '../api/client.js';

function QuestCard({ quest, onUpdated }) {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  async function submit() {
    try {
      const res = await api.post(`/quests/${quest._id}/submit`, { content, mediaUrl });
      onUpdated && onUpdated(res.data);
    } catch (e) {
      alert(e.response?.data?.error || 'Submit failed');
    }
  }

  async function vote(submissionId) {
    try {
      const res = await api.post(`/quests/${quest._id}/vote`, { submissionId });
      onUpdated && onUpdated(res.data);
    } catch (e) {
      alert(e.response?.data?.error || 'Vote failed');
    }
  }

  const deadline = quest.expiresAt ? new Date(quest.expiresAt) : null;

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <div className="font-bold text-lg">{quest.prompt}</div>
        <div className="text-sm opacity-70">Status: {quest.status} {deadline ? `• Deadline: ${deadline.toLocaleString()}` : ''}</div>
        {(quest.status === 'assigned') && (
          <div className="mt-3">
            <textarea className="textarea textarea-bordered w-full" placeholder="Your submission" value={content} onChange={e => setContent(e.target.value)} />
            <input className="input input-bordered w-full mt-2" placeholder="Optional image URL" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} />
            <button className="btn btn-primary mt-2" onClick={submit}>Submit</button>
          </div>
        )}
        {quest.submissions?.length ? (
          <div className="mt-4">
            <div className="font-semibold mb-2">Submissions</div>
            <div className="grid md:grid-cols-2 gap-3">
              {quest.submissions.map(s => (
                <div key={s._id} className="p-3 border rounded">
                  <div className="mb-2">{s.content}</div>
                  {s.mediaUrl ? <img src={s.mediaUrl} className="rounded max-h-64" /> : null}
                  <div className="flex justify-between mt-2">
                    <div className="badge badge-ghost">Votes: {s.votes?.length || 0}</div>
                    {quest.status === 'voting' && <button className="btn btn-sm" onClick={() => vote(s._id)}>Vote</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default QuestCard;


