import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Cat, LogOut, Settings, UserCog } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="border-r border-base-300 absolute h-full 
       left-0 z-40 backdrop-blur-sm bg-base-100/80"
    >
      <div className="container mx-auto px-1 h-16">
        <div className="flex flex-col items-center justify-between h-screen">
          <div className="flex flex-col items-center gap-8 mt-4">
            <Link
              to="/"
              className="flex flex-col gap-1 items-center hover:opacity-80 transition-all"
            >
              <h1 className="text-primary font-light">NotDiskord</h1>
              <div className="rounded-lg bg-primary/10 flex items-center justify-center">
                <Cat
                  className="w-16 text-primary"
                  size={25}
                  strokeWidth={0.75}
                  absoluteStrokeWidth
                />
              </div>
            </Link>
          </div>

          <div className="flex flex-col items-center gap-2 mb-4">
            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <UserCog
                    className="w-10 text-primary"
                    size={25}
                    strokeWidth={0.75}
                    absoluteStrokeWidth
                  />
                  <span className="hidden">Profile</span>
                </Link>
              </>
            )}

            <Link
              to={"/settings"}
              className={`btn btn-sm gap-2 transition-colors`}
            >
              <Settings
                className="w-10 text-primary"
                size={25}
                strokeWidth={0.75}
                absoluteStrokeWidth
              />
              <span className="hidden">Settings</span>
            </Link>

            {authUser && (
              <>
                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut
                    className="w-10 text-primary"
                    size={25}
                    strokeWidth={0.75}
                    absoluteStrokeWidth
                  />
                  <span className="hidden">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
