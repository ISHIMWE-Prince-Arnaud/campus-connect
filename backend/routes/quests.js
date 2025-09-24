const express = require('express');
const { authRequired } = require('../middleware/auth');
const Quest = require('../models/Quest');
const { submitSchema, voteSchema } = require('../utils/validation');
const { submitQuest, voteSubmission } = require('../services/questsService');

const router = express.Router();

router.get('/me', authRequired, async (req, res) => {
  const quests = await Quest.find({ participants: req.user._id, status: { $ne: 'archived' } });
  res.json(quests);
});

router.post('/:questId/submit', authRequired, async (req, res) => {
  try {
    const { content, mediaUrl } = await submitSchema.validateAsync(req.body);
    const quest = await submitQuest(req.params.questId, req.user._id, content, mediaUrl);
    res.json(quest);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/:questId/vote', authRequired, async (req, res) => {
  try {
    const { submissionId } = await voteSchema.validateAsync(req.body);
    const quest = await voteSubmission(req.params.questId, req.user._id, submissionId);
    res.json(quest);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;


