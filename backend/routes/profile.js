import { Router } from "express";
import bcrypt from "bcryptjs";
import sanitize from "mongo-sanitize";
import User from "../models/User.js";
import { registerSchema } from "../utils/validation.js";

const router = Router();

// Get current user profile
import { authRequired } from "../middleware/auth.js";
router.get("/me", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      gender: user.gender,
      points: user.points,
      roles: user.roles,
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Update profile fields
router.put("/me", authRequired, async (req, res) => {
  try {
    const updates = {};
    if (req.body.username) updates.username = sanitize(req.body.username);
    if (req.body.displayName) updates.displayName = req.body.displayName;
    if (req.body.avatarUrl) updates.avatarUrl = req.body.avatarUrl;
    if (req.body.gender) updates.gender = req.body.gender;
    if (req.body.password) {
      updates.passwordHash = await bcrypt.hash(req.body.password, 10);
    }
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    });
    res.json({
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      gender: user.gender,
      points: user.points,
      roles: user.roles,
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
