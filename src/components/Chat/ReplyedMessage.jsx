import { useStateProvider } from "@/context/StateContext";
import React from "react";

const ReplyedMessage = ({ message }) => {
  const [{ currentChatUser }] = useStateProvider();
    console.log(currentChatUser.id);
  return (
    <div
      className={`px-2 py-[2px] text-sm -mb-2 p-2 flex rounded-t-md flex-col max-w-sm min-w-52 ${
        message.senderId === currentChatUser.id
          ? " bg-incoming-background"
          : "bg-outgoing-background"
      }`}
    >
      <div className="p-2 mt-1 flex flex-col gap-2 bg-icon-lighter rounded-t-md">
        <div className="flex items-center justify-start">
          <span
            className={`font-semibold text-sm text-gray-900}`}
          >
         { message.replyToUserId === currentChatUser.id ? currentChatUser.name : "You"}
          </span>
        </div>
        <div className="text-sm font-normal max-h-4 text-wrap">
          {message.repliedmessage}
        </div>
      </div>
    </div>
  );
};

export default ReplyedMessage;
