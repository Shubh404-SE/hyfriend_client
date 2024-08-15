import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import { calculateTime } from "@/utils/CalculateTime";
import Image from "next/image";
import React, { useState } from "react";
import MessageStatus from "../common/MessageStatus";
import { PhotoView } from "react-photo-view";
import { FaAngleDown } from "react-icons/fa";
import MessageMenu from "./MessageMenu";

function ImageMessage({ message, index, options }) {
  const [{ currentChatUser, userInfo }] = useStateProvider();
  const [showMenu, setShowMenu] = useState(false);
  const self = message?.senderId === currentChatUser?.id;

  return (
    <div
      className={`p-1 rounded-lg ${
        message.senderId === currentChatUser.id
          ? " bg-incoming-background"
          : "bg-outgoing-background"
      }`}
    >
      <div className="relative group">
        <PhotoView key={index} src={`${HOST}/${message.message}`}>
          <Image
            src={`${HOST}/${message.message}`}
            className=" rounded-lg"
            alt="asset"
            height={300}
            width={300}
          />
        </PhotoView>
        <div className=" absolute bottom-1 right-1 flex items-end gap-1">
          <span className=" text-bubble-meta text-[11px] pt-1 min-w-fit">
            {calculateTime(message.createdAt)}
          </span>
          <span className=" text-bubble-meta">
            <span className=" text-bubble-meta">
              {message.senderId === userInfo.id && (
                <MessageStatus messageStatus={message.messageStatus} />
              )}
            </span>
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
    </div>
  );
}

export default ImageMessage;
