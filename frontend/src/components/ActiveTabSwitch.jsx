import { useChatStore } from "../store/useChatStore";
import FriendsList from "./FriendList";
import Requests from "./Requests";
import Search from "./Search";

const ActiveTabSwitch = () => {
  const { friends, friendRequests, activeTab, setActiveTab } = useChatStore();

  return (
    <div
      role="tablist"
      className="tabs tabs-lifted bg-base-200 gap-2 flex flex-col 
    items-center justify-center lg:flex lg:flex-row"
    >
      <button
        role="tab"
        onClick={() => setActiveTab("friends")}
        className={`tab tab-active ${
          activeTab === "friends" ? "bg-base-300" : "text-base-400"
        } `}
      >
        Friends ({friends.length})
      </button>

      <button
        role="tab"
        onClick={() => setActiveTab("requests")}
        className={`tab ${
          activeTab === "requests" ? "bg-base-300" : "text-base-400"
        } `}
      >
        Requests
        {friendRequests.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-error text-error-content text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {friendRequests.length}
          </span>
        )}
      </button>

      <button
        role="tab"
        onClick={() => setActiveTab("search")}
        className={`tab ${
          activeTab === "search" ? "bg-base-300" : "text-base-400"
        }  `}
      >
        Search
      </button>
    </div>
  );
};

export default ActiveTabSwitch;
