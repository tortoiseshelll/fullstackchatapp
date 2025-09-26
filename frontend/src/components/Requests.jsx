import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Check, X } from "lucide-react";

const Requests = () => {
  const {
    activeTab,
    friendRequests,
    getFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    isFriendRequestsLoading,
  } = useChatStore();

  useEffect(() => {
    getFriendRequests();
  }, [getFriendRequests]);

  const handleAcceptRequest = async (requestId) => {
    await acceptFriendRequest(requestId);
    getFriendRequests();
  };

  const handleRejectRequest = async (requestId) => {
    await rejectFriendRequest(requestId);
    getFriendRequests();
  };

  return (
    <div>
      {activeTab === "requests" && (
        <div>
          {isFriendRequestsLoading ? (
            <div className="flex items-center justify-center py-8">
              <SidebarSkeleton />
            </div>
          ) : (
            <>
              {friendRequests.map((request) => (
                <div
                  key={request._id}
                  className="p-3 flex items-center gap-3 border-b border-base-300 last:border-b-0"
                >
                  <div className="relative">
                    <img
                      src={request.from.profilePic || "/avatar.png"}
                      alt={request.from.fullName}
                      className="size-12 object-cover rounded-full"
                    />
                    <span
                      className="absolute top-0 right-0 size-full ring-gray-500
                  rounded-full ring-1"
                    />
                  </div>

                  <div className="flex-1 text-left min-w-0">
                    <div className="font-medium truncate">
                      {request.from.fullName}
                    </div>
                    <p className="text-sm text-base-content/70">
                      Wants to be friends
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(request._id)}
                      className="btn btn-circle btn-xs btn-success text-white"
                      title="Accept"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request._id)}
                      className="btn btn-circle btn-xs btn-error text-white"
                      title="Reject"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {friendRequests.length === 0 && !isFriendRequestsLoading && (
                <div className="text-center text-zinc-500 py-8">
                  <p>No friend requests</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Requests;
