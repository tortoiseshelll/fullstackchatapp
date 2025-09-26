import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
} from "../controllers/friends.controller.js";

const router = express.Router();

router.get("/", protectRoute, getFriends);
router.get("/requests", protectRoute, getFriendRequests);
router.post("/request", protectRoute, sendFriendRequest);

router.post("/accept/:id", protectRoute, acceptFriendRequest);
router.post("/reject/:id", protectRoute, rejectFriendRequest);
router.delete("/remove/:id", protectRoute, removeFriend);

export default router;
