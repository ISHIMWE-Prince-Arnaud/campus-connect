

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/client.js';
import { toast } from 'react-hot-toast';

function getCountdown(deadline) {
  if (!deadline) return '';
  const now = Date.now();
  const diff = Math.max(0, deadline.getTime() - now);
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  return `${d}d ${h}h ${m}m`;
}

const steps = [
  { key: 'assigned', label: 'Assigned' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'voting', label: 'Voting' },
  { key: 'archived', label: 'Results' }
];

function QuestCard({ quest, onUpdated }) {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');


  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  async function submit() {
    // Validate required fields
    if (!content.trim()) {
      toast.error('Submission content is required.');
      return;
    }
    if (mediaUrl && !isValidUrl(mediaUrl)) {
      toast.error('Please enter a valid image URL.');
      return;
    }
    try {
      const res = await api.post(`/quests/${quest._id}/submit`, { content, mediaUrl });
      onUpdated && onUpdated(res.data);
      toast.success('Submission sent!');
      setContent('');
      setMediaUrl('');
      // ...reset any error flags if present...
    } catch (e) {
      toast.error(e.response?.data?.error || 'Submit failed');
    }
  }

  async function vote(submissionId) {
    try {
      const res = await api.post(`/quests/${quest._id}/vote`, { submissionId });
      onUpdated && onUpdated(res.data);
      toast.success('Vote submitted!');
    } catch (e) {
      toast.error(e.response?.data?.error || 'Vote failed');
    }
  }

  const deadline = quest.expiresAt ? new Date(quest.expiresAt) : null;
  const countdown = getCountdown(deadline);
  const currentStep = steps.findIndex(s => s.key === quest.status);

  return (
    <motion.div
      className="card-elevated glass mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .35, ease: [0.18,0.67,0.6,1.22] }}
    >
      <div className="card-body">
        <div className="font-display grad-text text-xl font-bold mb-2">{quest.prompt}</div>
        <div className="flex items-center gap-3 mb-2">
          <div className="badge badge-grad font-mono text-xs px-2 py-1">Status: {steps[currentStep]?.label}</div>
          {deadline ? <div className="badge badge-ghost font-mono text-xs">Deadline: {deadline.toLocaleString()}</div> : null}
          {countdown ? <div className="badge badge-info font-mono text-xs">{countdown} left</div> : null}
        </div>
        {/* Progress stepper */}
        <div className="flex gap-2 mb-4">
          {steps.map((step, idx) => (
            <div key={step.key} className={`flex-1 h-2 rounded-full ${idx <= currentStep ? 'bg-primary' : 'bg-base-300'}`}></div>
          ))}
        </div>
        {(quest.status === 'assigned') && (
          <form className="mt-3" onSubmit={e => { e.preventDefault(); submit(); }}>
            <textarea className="textarea textarea-bordered w-full rounded-xl mb-2" placeholder="Your submission" value={content} onChange={e => setContent(e.target.value)} />
            <input className="input input-bordered w-full rounded-xl mb-2" placeholder="Optional image URL" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} />
            <motion.button
              type="submit"
              className="btn grad-text font-semibold px-6 py-2 rounded-xl shadow-glow-primary mt-2"
              whileTap={{ scale: .92 }}
              whileHover={{ scale: 1.03 }}
            >Submit</motion.button>
          </form>
        )}
        {quest.submissions?.length ? (
          <div className="mt-4">
            <div className="font-semibold mb-2">Submissions</div>
            <div className="grid md:grid-cols-2 gap-3">
              {quest.submissions.map(s => (
                <motion.div key={s._id} className="p-3 border border-white/10 rounded-xl card-elevated glass"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: .3 }}
                >
                  <div className="mb-2 text-base-content/90">{s.content}</div>
                  {s.mediaUrl ? <img src={s.mediaUrl} alt={s.altText || s.title || ''} className="rounded-xl max-h-64 mb-2 object-cover border border-white/10" /> : null}
                  <div className="flex justify-between mt-2 items-center">
                    <div className="badge badge-info font-mono">Votes: {s.votes?.length || 0}</div>
                    {quest.status === 'voting' && <motion.button className="btn btn-sm grad-text" whileTap={{ scale: .92 }} whileHover={{ scale: 1.03 }} onClick={() => vote(s._id)}>Vote</motion.button>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

export default QuestCard;


