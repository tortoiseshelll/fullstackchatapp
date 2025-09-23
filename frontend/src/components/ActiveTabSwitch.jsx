import React from "react";
import { useChatStore } from "../store/useChatStore";

const ActiveTabSwitch = () => {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="tabs tabs-boxed bg-transparent">
      <button
        onClick={() => setActiveTab("chats")}
        className={`tab ${
          activeTab === "chats" ? "bg-base-300" : "text-slate-400"
        }`}
      >
        Chats
      </button>
      <button
        onClick={() => setActiveTab("friends")}
        className={`tab ${
          activeTab === "friends" ? "bg-base-300" : "text-slate-400"
        }`}
      >
        Friendlist
      </button>
      <button
        onClick={() => setActiveTab("search")}
        className={`tab ${
          activeTab === "search" ? "bg-base-300" : "text-slate-400"
        }`}
      >
        Search
      </button>
    </div>
  );
};

export default ActiveTabSwitch;
