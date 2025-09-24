const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../utils/config');
const User = require('../models/User');

async function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

function adminRequired(req, res, next) {
  if (!req.user || !req.user.roles.includes('admin')) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

module.exports = { authRequired, adminRequired };


