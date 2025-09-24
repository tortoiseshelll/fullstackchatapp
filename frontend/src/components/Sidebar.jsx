import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "../components/skeletons/SidebarSkeleton";
import { Handshake } from "lucide-react";
import ActiveTabSwitch from "./ActiveTabSwitch";
import ChatsList from "./ChatsList";
import FriendList from "./FriendList";
import Search from "./Search";

const Sidebar = () => {
  const { getUsers, isUsersLoading, activeTab } = useChatStore();
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside
      className="h-screen w-24 lg:w-80 border-r border-base-300 flex flex-col 
    transition-all duration-200 pt-2"
    >
      <div className="flex items-center gap-2 ml-2">
        <Handshake
          className="text-primary"
          size={30}
          strokeWidth={0.75}
          absoluteStrokeWidth
        />
        <span className="font-medium lg:block">v. 1.1</span>
      </div>

      <div className="border-t border-base-300 mt-2 lg:block">
        <ActiveTabSwitch />

        <div className="border-t border-base-300 pt-2">
          {activeTab === "chats" ? (
            <ChatsList />
          ) : activeTab === "friends" ? (
            <FriendList />
          ) : (
            <Search searchKey={searchKey} setSearchKey={setSearchKey} />
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
