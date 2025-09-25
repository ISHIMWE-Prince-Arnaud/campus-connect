import React, { useEffect, useState } from 'react';
import api from '../api/client.js';
import QuestCard from '../components/QuestCard.jsx';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function Quests({ user }) {
  const [quests, setQuests] = useState([]);

  function load() {
    api.get('/quests/me')
      .then(res => setQuests(res.data))
      .catch(e => toast.error(e.response?.data?.error || 'Failed to load quests'));
  }

  useEffect(() => { load(); }, []);

  function onUpdated(_quest) {
    load();
  }

  return (
    <div className="grid gap-4">
      {quests.length === 0 ? <div className="alert">No active quests yet. Check back Monday morning!</div> : null}
      {quests.map(q => (
        <div key={q._id} className="space-y-2">
          <QuestCard quest={q} onUpdated={onUpdated} />
          {q.chatId ? <Link to={`/chat/${q.chatId}`} className="btn btn-outline btn-sm">Open Chat</Link> : null}
        </div>
      ))}
    </div>
  );
}

export default Quests;


