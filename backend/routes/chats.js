const express = require('express');
const { authRequired } = require('../middleware/auth');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const { messageSchema } = require('../utils/validation');

const router = express.Router();

router.get('/:chatId', authRequired, async (req, res) => {
  const chat = await Chat.findById(req.params.chatId);
  if (!chat) return res.status(404).json({ error: 'Chat not found' });
  if (new Date(chat.expiresAt) <= new Date()) return res.status(403).json({ error: 'Chat expired' });
  if (!chat.participants.map(String).includes(String(req.user._id))) return res.status(403).json({ error: 'Forbidden' });
  const messages = await Message.find({ chat: chat._id }).sort({ createdAt: 1 }).limit(200).populate('sender','username displayName avatarUrl');
  res.json({ chatId: chat._id, type: chat.type, messages });
});

router.post('/:chatId/message', authRequired, async (req, res) => {
  try {
    const { text, mediaUrl } = await messageSchema.validateAsync(req.body);
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    if (new Date(chat.expiresAt) <= new Date()) return res.status(403).json({ error: 'Chat expired' });
    if (!chat.participants.map(String).includes(String(req.user._id))) return res.status(403).json({ error: 'Forbidden' });

    const msg = await Message.create({
      chat: chat._id,
      sender: req.user._id,
      text,
      mediaUrl: mediaUrl || ''
    });
    const io = req.app.get('io');
    io.to(String(chat._id)).emit('chat:new', { chatId: String(chat._id), message: { id: String(msg._id), sender: { id: String(req.user._id), username: req.user.username, displayName: req.user.displayName }, text: msg.text, createdAt: msg.createdAt } });
    res.status(201).json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;


