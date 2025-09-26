import mongoose from "mongoose";

const friendlistSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

friendlistSchema.index({ user1: 1, user2: 1 }, { unique: true });

const Friendship = mongoose.model("Friendship", friendlistSchema);

export default Friendship;
