import React from "react";
import UserList from "./UserList";

const Search = ({ searchKey, setSearchKey }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="">
        <input
          type="text"
          className={`input border-base-300 text-sm w-full max-w-60 lg:mx-9
          focus:outline-none hover:outline-none size-9 mb-2 
          text-base-400 placeholder-current text-center truncate`}
          placeholder="Search username"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />
      </div>

      <UserList searchKey={searchKey} />
    </div>
  );
};

export default Search;
