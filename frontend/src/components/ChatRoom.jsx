import React, { useEffect, useRef, useState } from 'react';
import api from '../api/client.js';

function ChatRoom({ chatId, socket }) {
  const [messages, setMessages] = useState([]);
  const [meta, setMeta] = useState(null);
  const [text, setText] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    async function load() {
      const res = await api.get(`/chats/${chatId}`);
      setMeta({ type: res.data.type });
      setMessages(res.data.messages || []);
    }
    load().catch(() => setMessages([]));
  }, [chatId]);

  useEffect(() => {
    if (!socket) return;
    socket.emit('join:chat', { chatId });
    const handler = (payload) => {
      if (String(payload.chatId) !== String(chatId)) return;
      setMessages((m) => [...m, payload.message]);
    };
    socket.on('chat:new', handler);
    return () => socket.off('chat:new', handler);
  }, [socket, chatId]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  async function send() {
    if (!text.trim()) return;
    await api.post(`/chats/${chatId}/message`, { text });
    setText('');
  }

  return (
    <div className="card bg-base-100 shadow h-[70vh]">
      <div className="card-body overflow-hidden">
        <div className="mb-2 font-semibold capitalize">{meta?.type} chat</div>
        <div ref={listRef} className="grow overflow-auto space-y-2">
          {messages.map((m) => (
            <div key={m.id || m._id} className="chat chat-start">
              <div className="chat-header">{m.sender?.displayName || m.sender?.username || 'User'}</div>
              <div className="chat-bubble">{m.text}</div>
              <div className="chat-footer opacity-50 text-xs">{new Date(m.createdAt).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input className="input input-bordered w-full" value={text} onChange={e => setText(e.target.value)} placeholder="Type message..." />
          <button className="btn btn-primary" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;


