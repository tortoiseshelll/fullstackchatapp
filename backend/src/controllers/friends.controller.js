import FriendRequest from "../models/friendReq.model.js";
import Friendship from "../models/friendlist.model.js";
import User from "../models/user.model.js";
import { io } from "../lib/socket.js";

export const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const friendships = await Friendship.find({
      $or: [{ user1: userId }, { user2: userId }],
    })
      .populate("user1", "fullName email profilePic")
      .populate("user2", "fullName email profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(friendships);
  } catch (error) {
    console.log("Error in getFriends controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const incoming = await FriendRequest.find({
      to: userId,
      status: "pending",
    })
      .populate("from", "fullName email profilePic")
      .sort({ createdAt: -1 });

    const sent = await FriendRequest.find({
      from: userId,
      status: "pending",
    })
      .populate("to", "fullName email profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({ incoming, sent });
  } catch (error) {
    console.log("Error in getFriendRequests controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    const senderId = req.user._id;

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (userId === senderId.toString()) {
      return res
        .status(400)
        .json({ error: "Cannot send friend request to yourself" });
    }

    const existingFriendship = await Friendship.findOne({
      $or: [
        { user1: senderId, user2: userId },
        { user1: userId, user2: senderId },
      ],
    });

    if (existingFriendship) {
      return res.status(400).json({ error: "Already friends" });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { from: senderId, to: userId },
        { from: userId, to: senderId },
      ],
      status: { $in: ["pending", "accepted"] },
    });

    if (existingRequest) {
      return res.status(400).json({ error: "Friend request already exists" });
    }

    const friendRequest = new FriendRequest({
      from: senderId,
      to: userId,
    });

    await friendRequest.save();
    await friendRequest.populate("to", "fullName email profilePic");

    io.to(userId.toString()).emit("friendRequestReceived", { from: senderId });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.log("Error in sendFriendRequest controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user._id;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    if (friendRequest.to.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const friendship = new Friendship({
      user1: friendRequest.from,
      user2: friendRequest.to,
    });

    await friendship.save();
    await friendship.populate("user1", "fullName email profilePic");
    await friendship.populate("user2", "fullName email profilePic");

    friendRequest.status = "accepted";
    await friendRequest.save();

    const senderId = friendRequest.from.toString();
    const receiverId = friendRequest.to.toString();

    io.to(senderId).emit("friendRequestAccepted", {
      by: receiverId,
      friendship: friendship,
    });

    res.status(200).json({ friendship, message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user._id;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    if (friendRequest.to.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const senderId = friendRequest.from.toString();
    const receiverId = friendRequest.to.toString();

    await FriendRequest.findByIdAndDelete(requestId);

    io.to(senderId).emit("friendRequestRejected", {
      by: receiverId,
    });

    res.status(200).json({ message: "Friend request rejected and removed" });
  } catch (error) {
    console.log("Error in rejectFriendRequest controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const friendshipId = req.params.id;
    const userId = req.user._id;

    const friendship = await Friendship.findById(friendshipId);
    if (!friendship) {
      return res.status(404).json({ error: "Friendship not found" });
    }

    if (
      friendship.user1.toString() !== userId.toString() &&
      friendship.user2.toString() !== userId.toString()
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Friendship.findByIdAndDelete(friendshipId);

    await FriendRequest.deleteMany({
      $or: [
        { from: friendship.user1, to: friendship.user2 },
        { from: friendship.user2, to: friendship.user1 },
      ],
    });

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.log("Error in removeFriend controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
