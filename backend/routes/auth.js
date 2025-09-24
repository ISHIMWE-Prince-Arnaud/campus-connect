const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sanitize = require('mongo-sanitize');
const { registerSchema, loginSchema } = require('../utils/validation');
const { jwtSecret } = require('../utils/config');
const User = require('../models/User');
const { awardPointsToUser, POINTS } = require('../services/pointsService');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const value = await registerSchema.validateAsync(req.body);
    const exists = await User.findOne({ $or: [{ username: value.username }, { email: value.email }] });
    if (exists) return res.status(400).json({ error: 'Username or email already used' });
    const passwordHash = await bcrypt.hash(value.password, 10);
    const doc = await User.create({
      username: sanitize(value.username),
      displayName: value.displayName || value.username,
      email: sanitize(value.email),
      passwordHash,
      gender: value.gender,
      avatarUrl: value.avatarUrl || ''
    });
    const token = jwt.sign({ id: doc._id }, jwtSecret, { expiresIn: '7d' });
    await awardPointsToUser(doc._id, POINTS.STREAK_LOGIN, 'Join bonus');
    res.json({ token, user: { id: doc._id, username: doc.username, displayName: doc.displayName, roles: doc.roles, points: doc.points } });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const value = await loginSchema.validateAsync(req.body);
    const user = await User.findOne({ username: sanitize(value.username) });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(value.password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    user.lastLoginAt = new Date();
    await user.save();
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, displayName: user.displayName, roles: user.roles, points: user.points } });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/me', async (req, res) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    res.json({ id: user._id, username: user.username, displayName: user.displayName, roles: user.roles, points: user.points });
  } catch (e) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

module.exports = router;


