const express = require('express');
const sanitize = require('mongo-sanitize');
const { authRequired } = require('../middleware/auth');
const { createPostSchema, reactSchema, reportSchema } = require('../utils/validation');
const { filterProfanity, validateMediaUrl } = require('../services/moderationService');
const Post = require('../models/Post');
const Report = require('../models/Report');
const User = require('../models/User');
const { awardPointsToUser, POINTS } = require('../services/pointsService');

function parseMentions(text) {
  const at = text.match(/@([a-zA-Z0-9_]+)/g) || [];
  return [...new Set(at.map(s => s.slice(1).toLowerCase()))];
}

function applyReactionCounts(post) {
  const counts = { like:0, laugh:0, fire:0, relatable:0 };
  post.reactions.forEach(r => { counts[r.type] += 1; });
  post.reactionCounts = counts;
}

const router = express.Router();

// GET paginated
router.get('/', async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const pageSize = Math.min(Math.max(parseInt(req.query.pageSize || '20', 10), 1), 50);
  const posts = await Post.find({ status: { $ne: 'removed' } })
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .populate('author', 'username displayName avatarUrl points');
  res.json(posts);
});

// Create post
router.post('/', authRequired, async (req, res) => {
  try {
    const value = await createPostSchema.validateAsync(req.body);
    if (value.mediaUrl && !validateMediaUrl(value.mediaUrl)) {
      return res.status(400).json({ error: 'Invalid image URL' });
    }
    const content = filterProfanity(sanitize(value.content));
    const mentionUsernames = parseMentions(content);
    const mentionUsers = await User.find({ username: { $in: mentionUsernames } }).select('_id');
    let post = await Post.create({
      author: req.user._id,
      content,
      mediaUrl: value.mediaUrl || '',
      mentions: mentionUsers.map(u => u._id)
    });
    // populate author for immediate UI use
    post = await Post.findById(post._id).populate('author', 'username displayName avatarUrl points');
    await awardPointsToUser(req.user._id, POINTS.POST_CREATE, 'Create post');
    req.app.get('io').emit('post:reacted', { postId: String(post._id), reactionCounts: post.reactionCounts });
    res.status(201).json(post);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// React
router.post('/:id/react', authRequired, async (req, res) => {
  try {
    const { type } = await reactSchema.validateAsync(req.body);
    const post = await Post.findById(req.params.id);
    if (!post || post.status === 'removed') return res.status(404).json({ error: 'Post not found' });

    const existingIdx = post.reactions.findIndex(r => String(r.user) === String(req.user._id));
    if (existingIdx >= 0) {
      post.reactions[existingIdx].type = type;
    } else {
      post.reactions.push({ user: req.user._id, type });
      await awardPointsToUser(req.user._id, POINTS.POST_REACT, 'React to post');
    }
    applyReactionCounts(post);
    await post.save();
    req.app.get('io').emit('post:reacted', { postId: String(post._id), reactionCounts: post.reactionCounts });
    res.json({ reactionCounts: post.reactionCounts });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Report
router.post('/:id/report', authRequired, async (req, res) => {
  try {
    const { reason } = await reportSchema.validateAsync(req.body);
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const report = await Report.create({
      targetType: 'post',
      targetId: post._id,
      reporter: req.user._id,
      reason
    });
    post.status = 'flagged';
    await post.save();
    res.json({ ok: true, reportId: report._id });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Single
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'username displayName avatarUrl');
  if (!post || post.status === 'removed') return res.status(404).json({ error: 'Not found' });
  res.json(post);
});

module.exports = router;


