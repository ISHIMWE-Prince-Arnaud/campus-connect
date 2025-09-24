const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  targetType: { type: String, enum: ['post'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: String,
  status: { type: String, enum: ['open','closed'], default: 'open' }
}, { timestamps: { createdAt: 'createdAt' } });

module.exports = mongoose.model('Report', ReportSchema);


