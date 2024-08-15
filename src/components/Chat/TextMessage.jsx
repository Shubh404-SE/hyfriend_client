import { useStateProvider } from "@/context/StateContext";
import React, { useState } from "react";
import MessageStatus from "../common/MessageStatus";
import { calculateTime } from "@/utils/CalculateTime";
import { FaAngleDown, FaRegCopy } from "react-icons/fa";
import MessageMenu from "./MessageMenu";

function TextMessage({ message, options }) {
  const [{ currentChatUser, userInfo }] = useStateProvider();
  const [showMenu, setShowMenu] = useState(false);
  const self = message?.senderId === currentChatUser?.id;

  return (
    <div
      className={`group text-white px-2 py-[6px] text-sm rounded-md  relative max-w-[45%] flex gap-3 items-end p-3  break-all ${
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
      <div
        className={`${showMenu ? "" : "hidden"} group-hover:flex absolute
              -right-0 -top-[1px] cursor-pointer
            `}
        onClick={() => setShowMenu(true)}
      >
        <FaAngleDown
          className="text-panel-header-icon text-base hover:text-white hover:bg-inherit"
          id="context_opener"
          onClick={() => setShowMenu(true)}
        />
        {showMenu && (
          <MessageMenu
            self={self}
            setShowMenu={setShowMenu}
            showMenu={showMenu}
            options={options}
            message={message}
          />
        )}
      </div>
    </div>
  );
}

export default TextMessage;
