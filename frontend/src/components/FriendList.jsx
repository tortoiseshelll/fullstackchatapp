import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { UserMinus, Loader } from "lucide-react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

const FriendList = () => {
  const {
    activeTab,
    friends,
    selectedUser,
    setSelectedUser,
    getFriends,
    removeFriend,
    isFriendsLoading,
  } = useChatStore();

  const { onlineUsers, authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  const filteredFriends = showOnlineOnly
    ? friends.filter((friendship) => {
        const friend =
          friendship.user1._id === authUser._id
            ? friendship.user2
            : friendship.user1;
        return onlineUsers.includes(friend._id);
      })
    : friends;

  // const handleLogout = (e) => {
  //   e.stopPropagation();
  //   if (window.confirm("Do you want to logout?")) {
  //     logout();
  //   }
  // };

  const handleFriendClick = (friendship) => {
    const friend =
      friendship.user1._id === authUser._id
        ? friendship.user2
        : friendship.user1;
    setSelectedUser(friend);
  };

  const handleRemoveFriend = (e, friendshipId) => {
    e.stopPropagation();

    if (window.confirm(`Do you want to remove this friend?`)) {
      removeFriend(friendshipId);
    }
  };

  if (isFriendsLoading && friends.length === 0) {
    return (
      <div className="w-full flex flex-col h-[calc(100vh-6rem)]">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader className="size-8 animate-spin text-primary" />
            <p className="text-sm text-zinc-500">Loading friends...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-[calc(100vh-6rem)]">
      <div className=" flex-shrink-0  border-b border-base-300">
        {activeTab === "friends" && (
          <div className="hidden lg:flex items-center justify-between mb-2 mx-4">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="toggle toggle-xs toggle-primary"
              />
              <span className="text-xs">Online only</span>
            </label>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "friends" && (
          <div>
            {isFriendsLoading ? (
              <div className="flex items-center justify-center py-8">
                <SidebarSkeleton />
              </div>
            ) : (
              <>
                {filteredFriends.map((friendship) => {
                  const friend =
                    friendship.user1._id === authUser._id
                      ? friendship.user2
                      : friendship.user1;
                  const isOnline = onlineUsers.includes(friend._id);

                  return (
                    <button
                      key={friendship._id}
                      onClick={() => handleFriendClick(friendship)}
                      className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors group
                        ${
                          selectedUser?._id === friend._id
                            ? "bg-base-300 ring-1 ring-base-300"
                            : ""
                        }`}
                    >
                      <div className="relative mx-auto lg:mx-0">
                        <img
                          src={friend.profilePic || "/avatar.png"}
                          alt={friend.fullName}
                          className="size-12 object-cover rounded-full"
                        />
                        {isOnline ? (
                          <span
                            className="absolute top-0 right-0 size-full ring-lime-400
              rounded-full ring-2"
                          />
                        ) : (
                          <span
                            className="absolute top-0 right-0 size-full ring-gray-500
              rounded-full ring-2"
                          />
                        )}
                      </div>

                      <div className="hidden lg:block text-left min-w-0 flex-1">
                        <div
                          className={`font-medium truncate ${
                            !isOnline ? "opacity-50" : ""
                          }`}
                        >
                          {friend.fullName}
                        </div>
                        <p
                          className={`text-sm text-base-content/70 ${
                            isOnline ? "text-lime-400" : "opacity-50"
                          }`}
                        >
                          {isOnline ? "Online" : "Offline"}
                        </p>
                      </div>

                      <div
                        onClick={(e) => handleRemoveFriend(e, friendship._id)}
                        className="group-hover:flex btn btn-ghost btn-circle btn-xs text-primary hover:bg-error/20"
                        title="Remove friend"
                      >
                        <UserMinus
                          size={20}
                          strokeWidth={0.75}
                          absoluteStrokeWidth
                        />
                      </div>
                    </button>
                  );
                })}

                {filteredFriends.length === 0 && !isFriendsLoading && (
                  <div className="text-center text-zinc-500 py-8">
                    {showOnlineOnly ? "No friends online" : "No friends yet"}
                    {!showOnlineOnly && (
                      <p className="text-xs mt-2">
                        Use the Search tab to add friends
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendList;
