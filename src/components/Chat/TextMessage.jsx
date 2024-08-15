import { useStateProvider } from "@/context/StateContext";
import React, { useState } from "react";
import MessageStatus from "../common/MessageStatus";
import { calculateTime } from "@/utils/CalculateTime";
import { FaAngleDown, FaRegCopy } from "react-icons/fa";
import MessageMenu from "./MessageMenu";

function TextMessage({ message }) {
  const [{ currentChatUser, userInfo }] = useStateProvider();

  return (
    <div
      className={` text-white px-2 py-[6px] text-sm rounded-md flex gap-3 items-end p-2  break-all ${
        message.senderId === currentChatUser.id
          ? " bg-incoming-background"
          : "bg-outgoing-background"
      }`}
    >
      <span className=" break-all">{message.message}</span>
      <div className="flex gap-1 items-end">
        <span className=" text-bubble-meta text-[11px] pt-1 min-w-fit">
          {calculateTime(message.createdAt)}
        </span>
        <span>
          {message.senderId === userInfo.id && (
            <MessageStatus messageStatus={message.messageStatus} />
          )}
        </span>
      </div>
    </div>
  );
}

export default TextMessage;
