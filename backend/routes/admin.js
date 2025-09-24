const express = require('express');
const { authRequired, adminRequired } = require('../middleware/auth');
const Post = require('../models/Post');
const Report = require('../models/Report');
const User = require('../models/User');

const router = express.Router();

router.use(authRequired, adminRequired);

router.get('/reports', async (req, res) => {
  const reports = await Report.find({ status: 'open' }).sort({ createdAt: -1 });
  res.json(reports);
});

router.post('/posts/:id/remove', async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  post.status = 'removed';
  await post.save();
  await Report.updateMany({ targetId: post._id, status: 'open' }, { $set: { status: 'closed' } });
  res.json({ ok: true });
});

router.post('/posts/:id/restore', async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  post.status = 'active';
  await post.save();
  res.json({ ok: true });
});

router.post('/users/:id/penalize', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  const pts = Number(req.body.points || 0);
  await User.updateOne({ _id: user._id }, { $inc: { points: -Math.abs(pts) } });
  res.json({ ok: true });
});

router.post('/announce', async (req, res) => {
  const io = req.app.get('io');
  io.emit('leaderboard:updated', { top: [] });
  res.json({ ok: true });
});

module.exports = router;


