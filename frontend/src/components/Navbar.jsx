import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import {
  Cat,
  LogOut,
  Settings,
  UserCog,
  Volume2Icon,
  VolumeOffIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();

  return (
    <div
      className="border-r border-base-300 fixed h-full
       left-0 z-40 backdrop-blur-sm bg-base-100/80 w-12 lg:w-20"
    >
      <div className="container mx-auto px-1 h-16">
        <div className="flex flex-col items-center justify-between h-screen">
          <div className="flex flex-col items-center gap-8 mt-4">
            <Link
              to="/"
              className="flex flex-col gap-1 items-center hover:opacity-80 transition-all"
            >
              <h1 className="text-primary font-light hidden lg:block">
                NotDiskord
              </h1>
              <div className="rounded-lg bg-primary/10 flex items-center justify-center">
                <Cat
                  className="w-10 size-25 text-primary lg:w-16"
                  size={30}
                  strokeWidth={0.75}
                  absoluteStrokeWidth
                />
              </div>
            </Link>
          </div>

          <div className="flex flex-col items-center gap-3 mb-4">
            {authUser && (
              <button
                className="btn btn-sm btn-circle gap-0 transition-colors lg:btn-ghost"
                onClick={() => {
                  mouseClickSound.currentTime = 0;
                  mouseClickSound
                    .play()
                    .catch((error) =>
                      console.log("Audio play failed: ", error)
                    );
                  toggleSound();
                }}
              >
                {isSoundEnabled ? (
                  <Volume2Icon
                    className="w-10 text-primary"
                    size={25}
                    strokeWidth={0.75}
                    absoluteStrokeWidth
                  />
                ) : (
                  <VolumeOffIcon
                    className="w-10 text-primary"
                    size={25}
                    strokeWidth={0.75}
                    absoluteStrokeWidth
                  />
                )}
              </button>
            )}

            {authUser && (
              <>
                <Link
                  to={"/profile"}
                  className={`btn btn-sm btn-circle gap-0 transition-colors lg:mb-5 lg:btn-ghost`}
                >
                  <UserCog
                    className="w-10 text-primary"
                    size={25}
                    strokeWidth={0.75}
                    absoluteStrokeWidth
                  />
                  <span className="hidden lg:flex text-sm font-thin">
                    Profile
                  </span>
                </Link>
              </>
            )}

            <Link
              to={"/settings"}
              className={`btn btn-sm btn-circle gap-0 transition-colors lg:mb-5 lg:btn-ghost`}
            >
              <Settings
                className="w-10 text-primary"
                size={25}
                strokeWidth={0.75}
                absoluteStrokeWidth
              />
              <span className="hidden lg:flex text-sm font-thin">Settings</span>
            </Link>

            {authUser && (
              <>
                <button
                  className=" gap-0 transition-colors mb-2"
                  onClick={logout}
                >
                  <LogOut
                    className="w-10 text-primary"
                    size={25}
                    strokeWidth={0.75}
                    absoluteStrokeWidth
                  />
                  <span className="hidden lg:flex text-sm font-thin">
                    Logout
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
