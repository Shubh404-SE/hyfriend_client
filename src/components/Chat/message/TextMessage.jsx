import { useStateProvider } from "@/context/StateContext";
import React, { useState } from "react";
import MessageStatus from "../../common/MessageStatus";
import { calculateTime, formateDate } from "@/utils/CalculateTime";
import { wrapEmojisInHtmlTag } from "@/utils/Helper";

function TextMessage({ message, preview }) {
  const [{ currentChatUser, userInfo }] = useStateProvider();

  return (
    <div
      className={` text-white px-2 py-[1px] text-sm rounded-md flex flex-col max-w-sm min-w-12 ${
        message.senderId === currentChatUser.id
          ? " bg-incoming-background"
          : "bg-outgoing-background"
      }`}
    >
      <span className={`p-1 text-pretty ${preview? "max-h-[150px] truncate":""}`} dangerouslySetInnerHTML={{
                __html: wrapEmojisInHtmlTag(message.message),
              }}></span>
      <div className="flex items-end justify-end">
        <span className=" text-bubble-meta text-[11px] pt-1 min-w-fit">
          {formateDate(message.createdAt)}
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
