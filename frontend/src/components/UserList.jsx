import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Plus } from "lucide-react";

const UserList = ({ searchKey }) => {
  const { users, selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex-1 overflow-y-auto">
          {users
            .filter((user) => {
              if (searchKey.trim() === "") return false;

              return user.fullName?.toLowerCase() === searchKey?.toLowerCase();
            })

            .map((user) => (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-3 flex items-cente gap-3 hover:bg-base-300 transition-colors
        ${
          selectedUser?._id === user._id
            ? "bg-base-300 ring-1 ring-base-300"
            : ""
        }`}
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.name}
                    className="size-12 object-cover rounded-full"
                  />

                  {onlineUsers.includes(user._id) ? (
                    <span
                      className="absolute top-0 right-0 size-full ring-lime-500
              rounded-full ring-2"
                    />
                  ) : (
                    <span
                      className="absolute top-0 right-0 size-full ring-gray-500
              rounded-full ring-2"
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

                <button className="btn btn-ghost btn-xs">
                    <Plus className="size-4" />
                </button>
              </button>

              
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;
