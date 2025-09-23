import React, { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const FriendList = () => {
  const { users, selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  return (
    <div className="w-full flex flex-col h-[calc(100vh-6rem)]">
      <div className="absolute hidden lg:flex items-center gap-2 top-4 left-48">
        <label className="cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="toggle toggle-xs toggle-primary ml-2"
          />
          <span className="text-xs">Online only</span>
        </label>
        <span className="text-xs text-zinc-500">
          ({onlineUsers.length - 1} online)
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
        ${
          selectedUser?._id === user._id
            ? "bg-base-300 ring-1 ring-base-300"
            : ""
        }`}
          >
            <div className="relative mx-auto lg:mx-0 ring-1 ring-primary rounded-full">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />

              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute top-0.5 right-0.5 size-2.5 bg-lime-500
              rounded-full ring-1 ring-lime-600"
                />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div
                className={`font-medium truncate
              ${onlineUsers.includes(user._id) ? "" : "opacity-50"}
              `}
              >
                {user.fullName}
              </div>
              <p
                className={`text-sm text-base-content/70
              ${onlineUsers.includes(user._id) ? "text-lime-500" : "opacity-50"}
              `}
              >
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </p>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            No online friends
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendList;
