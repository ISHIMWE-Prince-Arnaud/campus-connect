import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

router.get('/weekly', async (req, res) => {
  const top = await User.find().sort({ points: -1 }).limit(10).select('username displayName avatarUrl points titles badges');
  res.json(top);
});

export default router;


