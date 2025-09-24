const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  points: Number,
  titles: [{ name: String, icon: String }]
}, { _id: false });

const LeaderboardSnapshotSchema = new mongoose.Schema({
  period: { type: String, enum: ['weekly','seasonal'], default: 'weekly' },
  start: Date,
  end: Date,
  entries: [EntrySchema]
}, { timestamps: true });

module.exports = mongoose.model('LeaderboardSnapshot', LeaderboardSnapshotSchema);


