import { useStateProvider } from "@/context/StateContext";
import React from "react";

const ReplyedMessage = ({ message }) => {
  const [{ currentChatUser }] = useStateProvider();
  return (
    <div
      className={`px-2 py-[2px] text-sm -mb-2 p-2 flex rounded-t-md flex-col max-w-sm min-w-40 cursor-pointer ${
        message.senderId === currentChatUser.id
          ? " bg-incoming-background"
          : "bg-outgoing-background"
      }`}
    >
      <div className="p-2 mt-1 flex flex-col gap-2 bg-icon-lighter hover:bg-icon-lighter/50 hover:text-white rounded-t-md transition-all duration-300">
        <div className="flex items-center justify-start">
          <span  className={`font-semibold text-sm text-indigo-800`}
          >
         { message.replyToUserId === currentChatUser.id ? currentChatUser.name : "You"}
          </span>
        </div>
        <div className="text-sm font-normal text-wrap truncate max-h-20">
          {message.repliedmessage}
        </div>
      </div>
    </div>
  );
};

export default ReplyedMessage;
