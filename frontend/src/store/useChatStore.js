import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  friends: [],
  friendRequests: [],
  sentRequests: [],
  isFriendsLoading: false,
  isFriendRequestsLoading: false,
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  activeTab: "friends",
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      if (newMessage.senderId !== selectedUser._id) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  getFriends: async () => {
    set({ isFriendsLoading: true });
    try {
      const res = await axiosInstance.get("/friends");
      const friendsData = Array.isArray(res.data)
        ? res.data
        : res.data.friendships || [];
      set({ friends: friendsData });
    } catch (error) {
      console.error("Error getting friends:", error);
      toast.error(error.response?.data?.message || "Failed to load friends");
    } finally {
      set({ isFriendsLoading: false });
    }
  },

  getFriendRequests: async () => {
    set({ isFriendRequestsLoading: true });
    try {
      const res = await axiosInstance.get("/friends/requests");
      set({
        friendRequests: res.data.incoming || [],
        sentRequests: res.data.sent || [],
      });
    } catch (error) {
      console.error("Error getting friend requests:", error);
      toast.error(
        error.response?.data?.message || "Failed to load friend requests"
      );
    } finally {
      set({ isFriendRequestsLoading: false });
    }
  },

  sendFriendRequest: async (userId) => {
    try {
      const res = await axiosInstance.post("/friends/request", { userId });

      const { sentRequests } = get();
      set({ sentRequests: [...sentRequests, res.data] });
      await get().getFriendRequests();

      toast.success("Friend request sent!");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  },

  acceptFriendRequest: async (requestId) => {
    try {
      const res = await axiosInstance.post(`/friends/accept/${requestId}`);

      const { friendRequests, friends } = get();
      set({
        friendRequests: friendRequests.filter((req) => req._id !== requestId),
        friends: [...friends, res.data.friendship],
      });

      await Promise.all([get().getFriends(), get().getFriendRequests()]);

      toast.success("Friend request accepted!");
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error(
        error.response?.data?.message || "Failed to accept friend request"
      );
    }
  },

  rejectFriendRequest: async (requestId) => {
    try {
      const res = await axiosInstance.post(`/friends/reject/${requestId}`);

      const { friendRequests } = get();
      set({
        friendRequests: friendRequests.filter((req) => req._id !== requestId),
      });

      await get().getFriendRequests();

      toast.success("Friend request rejected");
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      toast.error(
        error.response?.data?.message || "Failed to reject friend request"
      );
    }
  },

  subscribeToFriendRequests: () => {
    const socket = useAuthStore.getState().socket;

    if (!socket) {
      console.warn("Socket not available for friend request subscription");
      return;
    }

    console.log("Subscribing to friend request events...");

    socket.on("friendRequestReceived", (data) => {
      console.log("Friend request received via socket:", data);

      get().getFriendRequests();

      toast.success("You have a new friend request!");
    });

    socket.on("friendRequestAccepted", (data) => {
      console.log("Friend request accepted via socket:", data);

      get().getFriends();
      get().getFriendRequests();

      toast.success("Your friend request was accepted!");
    });

    socket.on("friendRequestRejected", (data) => {
      console.log("Friend request rejected via socket:", data);

      get().getFriendRequests();

      toast.info("Your friend request was declined");
    });
  },

  unsubscribeFromFriendRequests: () => {
    const socket = useAuthStore.getState().socket;

    if (socket) {
      console.log("Unsubscribing from friend request events...");
      socket.off("friendRequestReceived");
      socket.off("friendRequestAccepted");
      socket.off("friendRequestRejected");
    }
  },

  removeFriend: async (friendshipId) => {
    try {
      const res = await axiosInstance.delete(`/friends/remove/${friendshipId}`);

      const { friends } = get();
      set({
        friends: friends.filter(
          (friendship) => friendship._id !== friendshipId
        ),
      });
      toast.success("Friend removed");
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error(error.response?.data?.message || "Failed to remove friend");
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
