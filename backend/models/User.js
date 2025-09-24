const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  name: String,
  icon: String,
  expiresAt: Date
}, { _id: false });

const TitleSchema = new mongoose.Schema({
  name: String,
  icon: String,
  expiresAt: Date
}, { _id: false });

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, index: true },
  displayName: String,
  email: { type: String, unique: true },
  passwordHash: String,
  avatarUrl: String,
  gender: { type: String, enum: ['male','female','other'], default: 'other' },
  roles: { type: [String], default: ['student'] },
  points: { type: Number, default: 0 },
  badges: { type: [BadgeSchema], default: [] },
  titles: { type: [TitleSchema], default: [] },
  streak: { type: Number, default: 0 },
  lastLoginAt: Date
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('User', UserSchema);


