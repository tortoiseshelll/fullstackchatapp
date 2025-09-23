import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "../components/skeletons/SidebarSkeleton";
import { Handshake } from "lucide-react";
import ActiveTabSwitch from "./ActiveTabSwitch";
import ChatsList from "./ChatsList";
import FriendList from "./FriendList";
import Search from "./Search";

const Sidebar = () => {
  const { getUsers, isUsersLoading, activeTab } = useChatStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside
      className="h-screen w-24 lg:w-80 border-r border-base-300 flex flex-col 
    transition-all duration-200 ml-2 pt-2"
    >
      <div className="">
        <div className="flex items-center gap-2">
          <Handshake
            className="text-primary"
            size={30}
            strokeWidth={0.75}
            absoluteStrokeWidth
          />
          <span className="font-medium hidden lg:block">v.1.0</span>
        </div>

        <div className="border-t border-base-300 mt-2">
          <ActiveTabSwitch />

          <div className="border-t border-base-300 pt-2">
            {activeTab === "chats" ? (
              <ChatsList />
            ) : activeTab === "friends" ? (
              <FriendList />
            ) : (
              <Search />
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
