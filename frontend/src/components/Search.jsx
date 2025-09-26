import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { UserPlus, UserCheck, Clock } from "lucide-react";

const Search = ({ searchKey, setSearchKey }) => {
  const {
    activeTab,
    users,
    friends,
    sentRequests,
    getFriendRequests,
    selectedUser,
    setSelectedUser,
    sendFriendRequest,
  } = useChatStore();
  const { authUser } = useAuthStore();

  const filteredUsers = users.filter((user) => {
    if (user._id === authUser._id) return false;
    return user.fullName.toLowerCase() === searchKey.toLowerCase();
  });

  const getFriendStatus = (user) => {
    const isFriend = friends.some(
      (friendship) =>
        friendship.user1._id === user._id || friendship.user2._id === user._id
    );
    if (isFriend) return "friend";

    const requestSent = sentRequests.some(
      (request) => request.to._id === user._id
    );
    if (requestSent) return "pending";

    return "none";
  };

  const handleAddFriend = async (e, userId) => {
    e.stopPropagation();
    await sendFriendRequest(userId);
    getFriendRequests();
  };

  const handleUserClick = (user) => {
    const friendStatus = getFriendStatus(user);
    if (friendStatus === "friend") {
      setSelectedUser(user);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {activeTab === "search" && (
        <div>
          <div className="p-3">
            <input
              type="text"
              className="input border-base-300 text-sm w-full 
          focus:outline-none hover:outline-none h-9 mb-2"
              placeholder="Search exact username"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>

          <div>
            {filteredUsers.map((user) => {
              const friendStatus = getFriendStatus(user);

              return (
                <div
                  key={user._id}
                  className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors cursor-pointer
                ${
                  selectedUser?._id === user._id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }`}
                  onClick={() => handleUserClick(user)}
                >
                  <div className="relative mx-auto lg:mx-0">
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt={user.fullName}
                      className="size-12 object-cover rounded-full"
                    />
                    <span
                      className="absolute top-0 right-0 size-full ring-gray-500
              rounded-full ring-1"
                    />
                  </div>

                  <div className="hidden lg:block text-left min-w-0 flex-1">
                    <div
                      className={`font-medium truncate 
                  }`}
                    >
                      {user.fullName}
                    </div>
                  </div>

                  <div className="hidden lg:flex">
                    {friendStatus === "friend" && (
                      <span className="flex items-center gap-1 text-success text-xs mr-2">
                        <UserCheck size={16} />
                        Friends
                      </span>
                    )}
                    {friendStatus === "pending" && (
                      <span className="flex items-center gap-1 text-base-400 text-xs mr-2">
                        <Clock size={16} />
                        Pending
                      </span>
                    )}
                    {friendStatus === "none" && (
                      <button
                        onClick={(e) => handleAddFriend(e, user._id)}
                        className="btn btn-primary btn-xs btn-circle mr-2"
                      >
                        <UserPlus
                          size={19}
                          strokeWidth={0.75}
                          absoluteStrokeWidth
                        />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredUsers.length === 0 && searchKey.trim() !== "" && (
              <div className="text-center text-zinc-500 py-4">
                No users found matching "{searchKey}"
              </div>
            )}

            {searchKey.trim() === "" && (
              <div className="text-center text-zinc-500 py-4">
                Search for friends by their username
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
