import React, { useEffect, useState } from "react";
import Avatar from "../common/Avatar";
import {
  MdArrowBack,
  MdCall,
  MdExitToApp,
  MdOutlineAutoDelete,
  MdOutlineDelete,
} from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useStateProvider } from "@/context/StateContext";
import {
  REPLY_TO_MESSAGE,
  SET_EXIT_CHAT,
  SET_MESSAGE_SEARCH,
  SET_PROFILE_PAGE,
  SET_VIDEO_CALL,
  SET_VOICE_CALL,
  SHOW_CHATLIST,
} from "@/context/constants";
import ContextMenu from "../common/ContextMenu";

function ChatHeader() {
  const [{ currentChatUser, userInfo, onlineUsers, socket }, dispatch] =
    useStateProvider();
  const [isContextMenue, setIsContextMenue] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 600);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const showContextMenue = (e) => {
    e.preventDefault();
    setIsContextMenue(true);
  };

  const contextMenuOptions = [
    {
      Icon: <MdOutlineAutoDelete />,
      name: "Clear Chat",
      callback: () => {},
    },
    {
      Icon: <MdOutlineDelete />,
      name: "Delete Chat",
      callback: () => {},
    },
    {
      Icon: <MdExitToApp />,
      name: "Exit Chat",
      callback: async () => {
        socket.current.emit("change-chat", {
          userId: userInfo.id,
          previousContactId: currentChatUser?.id,
          newContactId: null,
        });
        dispatch({
          type: REPLY_TO_MESSAGE,
          data: undefined,
        });
        dispatch({
          type: SHOW_CHATLIST,
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

  const handleBack = () => {
    dispatch({
      type: REPLY_TO_MESSAGE,
      data: undefined,
    });
    dispatch({
      type: SHOW_CHATLIST,
    });
    dispatch({ type: SET_EXIT_CHAT });

    socket.current.emit("change-chat", {
      userId: userInfo.id,
      previousContactId: currentChatUser?.id,
      newContactId: null,
    });
  };

  return (
    <div className=" h-16 px-4 py-3 flex gap-2 items-center bg-panel-header-background z-10">
      {isMobileView && (
        <div
          className="py-2 text-xl cursor-pointer hover:scale-110 duration-200 transition-all"
          onClick={handleBack}
        >
          <MdArrowBack className="text-icon-lighter" />
        </div>
      )}

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
      <div className="flex items-center justify-center gap-3 ml-auto">
        <div
          className="text-panel-header-icon cursor-pointer text-xl hover:bg-conversation-panel-background rounded-full p-2"
          onClick={handleVoiceCall}
        >
          <MdCall title="Voice Call" />
        </div>
        <div
          className="text-panel-header-icon cursor-pointer text-xl hover:bg-conversation-panel-background rounded-full p-2 "
          onClick={handleVideoCall}
        >
          <IoVideocam title="Video Call" />
        </div>
        <div
          className="text-panel-header-icon cursor-pointer text-xl hover:bg-conversation-panel-background rounded-full p-2 "
          onClick={() => dispatch({ type: SET_MESSAGE_SEARCH })}
        >
          <BiSearchAlt2 title="Search Message" />
        </div>
        <div className=" relative">
          <div
            className="text-panel-header-icon cursor-pointer text-xl hover:bg-conversation-panel-background rounded-full p-2"
            onClick={(e) => showContextMenue(e)}
            id="context_opener"
          >
            <BsThreeDotsVertical id="context_opener" title="Options" />
          </div>
          {isContextMenue && (
            <ContextMenu
              options={contextMenuOptions}
              contextMenu={isContextMenue}
              setContextMenu={setIsContextMenue}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
