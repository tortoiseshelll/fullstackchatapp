import { Cat } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-3">
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl flex items-center
             justify-center animate-spin"
            >
              <Cat
                className="size-20 text-primary"
                size={25}
                strokeWidth={0.75}
                absoluteStrokeWidth
              />
            </div>
          </div>
        </div>

        <h2 className="text-2xl">NotDiskord</h2>
        <p className="text-base-content/60">Start chatting with friends!</p>
      </div>
    </div>
  );
};

export default NoChatSelected;
