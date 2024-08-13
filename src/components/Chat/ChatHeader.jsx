import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { MdCall } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useStateProvider } from "@/context/StateContext";
import {
  SET_EXIT_CHAT,
  SET_MESSAGE_SEARCH,
  SET_PROFILE_PAGE,
  SET_VIDEO_CALL,
  SET_VOICE_CALL,
} from "@/context/constants";
import ContextMenu from "../common/ContextMenu";

function ChatHeader() {
  const [{ currentChatUser, userInfo, onlineUsers, socket }, dispatch] =
    useStateProvider();
  const [isContextMenue, setIsContextMenue] = useState(false);
  const [contextMenueCordinates, setContextMenueCordinates] = useState({
    x: 0,
    y: 0,
  });

  const showContextMenue = (e) => {
    e.preventDefault();
    setIsContextMenue(true);
    setContextMenueCordinates({ x: e.pageX - 50, y: e.pageY + 26 });
  };

  const contextMenuOptions = [
    {
      name: "Exit",
      callback: async () => {
        socket.current.emit("change-chat", {
          userId: userInfo.id,
          previousContactId: currentChatUser?.id,
          newContactId: null,
        });
        dispatch({ type: SET_EXIT_CHAT });
      },
    },
  ];

  const handleVoiceCall = () => {
    dispatch({
      type: SET_VOICE_CALL,
      voiceCall: {
        ...currentChatUser,
        type: "out-going",
        callType: "voice",
        roomId: Date.now(),
      },
    });
  };

  const handleVideoCall = () => {
    dispatch({
      type: SET_VIDEO_CALL,
      videoCall: {
        ...currentChatUser,
        type: "out-going",
        callType: "video",
        roomId: Date.now(),
      },
    });
  };

  return (
    <div className=" h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div
        className=" flex items-center justify-center gap-6 cursor-pointer"
        onClick={() => {
          dispatch({ type: SET_PROFILE_PAGE, pageType: "chatuser" });
        }}
      >
        <Avatar
          type="sm"
          image={`${
            currentChatUser
              ? currentChatUser.profilePicture
              : "/default_avatar.png"
          }`}
        />
        <div className="flex flex-col">
          <span className="text-primary-strong">{currentChatUser?.name}</span>
          <span className="text-secondary text-sm">
            {onlineUsers.includes(currentChatUser.id) ? "online" : "offline"}
          </span>
        </div>
      </div>
      <div className="flex gap-6">
        <MdCall
          onClick={handleVoiceCall}
          className=" text-panel-header-icon cursor-pointer text-xl"
        />
        <IoVideocam
          onClick={handleVideoCall}
          className=" text-panel-header-icon cursor-pointer text-xl"
        />
        <BiSearchAlt2
          className=" text-panel-header-icon cursor-pointer text-xl"
          onClick={() => dispatch({ type: SET_MESSAGE_SEARCH })}
        />

        <BsThreeDotsVertical
          onClick={(e) => showContextMenue(e)}
          id="context_opener"
          className=" text-panel-header-icon cursor-pointer text-xl"
        />
        {isContextMenue && (
          <ContextMenu
            options={contextMenuOptions}
            cordinates={contextMenueCordinates}
            contextMenu={isContextMenue}
            setContextMenu={setIsContextMenue}
          />
        )}
      </div>
    </div>
  );
}

export default ChatHeader;
