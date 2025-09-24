import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  content: String,
  mediaUrl: String,
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { _id: true });

const QuestSchema = new mongoose.Schema({
  type: { type: String, enum: ['mysteryPair','group'], required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  prompt: String,
  status: { type: String, enum: ['assigned','submitted','voting','archived'], default: 'assigned' },
  assignedAt: Date,
  expiresAt: Date,
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  submissions: { type: [SubmissionSchema], default: [] }
}, { timestamps: true });

export default mongoose.model('Quest', QuestSchema);


