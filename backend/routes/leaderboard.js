const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/weekly', async (req, res) => {
  const top = await User.find().sort({ points: -1 }).limit(10).select('username displayName avatarUrl points titles badges');
  res.json(top);
});

module.exports = router;


