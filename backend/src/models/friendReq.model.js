import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

requestSchema.index({ from: 1, to: 1 }, { unique: true });

const FriendRequest = new mongoose.model("FriendRequest", requestSchema);

export default FriendRequest;
