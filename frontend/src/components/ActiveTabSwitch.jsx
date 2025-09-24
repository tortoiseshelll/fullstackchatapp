import React from "react";
import { useChatStore } from "../store/useChatStore";
import { MessageSquareMore } from "lucide-react";

const ActiveTabSwitch = () => {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div
      className="tabs tabs-lifted bg-base-200 gap-2 flex flex-col 
    items-center justify-center lg:flex lg:flex-row"
    >
      <button
        onClick={() => setActiveTab("chats")}
        className={`tab ${
          activeTab === "chats" ? "bg-base-300" : "text-base-400"
        } `}
      >
        <p className="">Chats</p>
      </button>
      <button
        onClick={() => setActiveTab("friends")}
        className={`tab ${
          activeTab === "friends" ? "bg-base-300" : "text-base-400"
        } `}
      >
        <p className="">Friends</p>
      </button>
      <button
        onClick={() => setActiveTab("search")}
        className={`tab ${
          activeTab === "search" ? "bg-base-300" : "text-base-400"
        }  `}
      >
        <p className="">Search</p>
      </button>
    </div>
  );
};

export default ActiveTabSwitch;
