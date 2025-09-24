import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  type: { type: String, enum: ['pair','group'], required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  expiresAt: { type: Date, index: { expires: 0 } } // TTL
}, { timestamps: true });

export default mongoose.model('Chat', ChatSchema);