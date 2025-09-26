import mongoose from "mongoose";

const ReactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    type: { type: String, enum: ["like", "laugh", "fire", "relatable"] },
  },
  { _id: false }
);

const PostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    content: String,
    mediaUrls: { type: [String], default: [] },
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reactions: { type: [ReactionSchema], default: [] },
    reactionCounts: {
      like: { type: Number, default: 0 },
      laugh: { type: Number, default: 0 },
      fire: { type: Number, default: 0 },
      relatable: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ["active", "flagged", "removed"],
      default: "active",
    },
  },
  { timestamps: { createdAt: "createdAt" } }
);

export default mongoose.model("Post", PostSchema);
