
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/client.js';
import { toast } from 'react-hot-toast';

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

  async function send(e) {
    if (e) e.preventDefault();
    if (!text.trim()) return;
    try {
      await api.post(`/chats/${chatId}/message`, { text });
      setText('');
      toast.success('Message sent!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send message');
    }
  }

  return (
    <motion.div
      className="card-elevated glass h-[70vh] mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .35, ease: [0.18,0.67,0.6,1.22] }}
    >
      <div className="card-body overflow-hidden flex flex-col h-full">
        <div className="mb-2 font-display grad-text text-lg font-bold capitalize">{meta?.type} chat</div>
        <div ref={listRef} className="grow overflow-auto space-y-2 pb-2">
          {messages.length === 0 ? (
            <div className="skeleton h-12 w-full mt-4" />
          ) : messages.map((m, idx) => (
            <motion.div
              key={m.id || m._id || idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .25, delay: idx * .04 }}
              className="chat chat-start"
            >
              <div className="chat-header font-mono text-xs text-base-content/70">{m.sender?.displayName || m.sender?.username || 'User'}</div>
              <div className="chat-bubble glass text-base-content/90 font-sans text-base shadow-soft">{m.text}</div>
              <div className="chat-footer opacity-50 text-xs font-mono">{new Date(m.createdAt).toLocaleTimeString()}</div>
            </motion.div>
          ))}
        </div>
        <form className="flex gap-2 mt-2" onSubmit={send}>
          <input
            className="input input-bordered w-full font-mono text-base rounded-xl"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type message..."
            aria-label="Message"
          />
          <motion.button
            type="submit"
            className="btn grad-text font-semibold px-6 py-2 rounded-xl shadow-glow-primary"
            whileTap={{ scale: .92 }}
            whileHover={{ scale: 1.03 }}
          >Send</motion.button>
        </form>
      </div>
    </motion.div>
  );
}

export default ChatRoom;


