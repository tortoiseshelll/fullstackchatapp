import React, { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { FileImage, Forward, Smile, X } from "lucide-react";
// import EmojiPicker from "emoji-picker-react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [openPicker, setOpenPicker] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage, selectedUser } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message: ", error);
    }
  };

  // const handleEmojiClick = (emojiData) => {
  //   setText((prev) => prev + emojiData.emoji);
  //   setOpenPicker(false);
  // };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {openPicker && (
        <div className="absolute bottom-20 right-4 z-50">
          {/* <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme="dark"
            previewConfig={{ showPreview: false }}
            skinTonesDisabled={true}
          /> */}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg 
            input-sm sm:input-md focus:border-none focus:outline-dashed focus:outline-offset-1 focus:outline-1"
            placeholder={`Message @${selectedUser.fullName} `}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            type="button"
            className={`absolute right-32 bottom-6 sm:flex btn btn-ghost btn-circle btn-sm bg-transparent
                     text-primary `}
            onClick={() => setOpenPicker(!openPicker)}
          >
            <Smile size={25} strokeWidth={1} absoluteStrokeWidth />
          </button>

          {openPicker && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpenPicker(false)}
            />
          )}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden absolute right-24 bottom-6 sm:flex btn btn-ghost btn-circle btn-sm
                     ${imagePreview ? "text-primary" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileImage size={25} strokeWidth={0.75} absoluteStrokeWidth />
          </button>
        </div>

        <button
          type="submit"
          className="sm:flex btn text-zinc-400"
          disabled={!text.trim() && !imagePreview}
        >
          <Forward size={25} strokeWidth={0.75} absoluteStrokeWidth />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
