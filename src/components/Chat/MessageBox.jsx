import React, { useState } from "react";
import TextMessage from "./TextMessage";
import ImageMessage from "./ImageMessage";
import dynamic from "next/dynamic";
const VoiceMessage = dynamic(() => import("./VoiceMessage"), { ssr: false });

import {
  MdDeleteOutline,
  MdOutlineAddReaction,
  MdOutlineInfo,
  MdOutlineReply,
} from "react-icons/md";
import { FaAngleDown, FaRegCopy } from "react-icons/fa";
import { toast } from "react-toastify";
import MessageMenu from "./MessageMenu";
import { useStateProvider } from "@/context/StateContext";
import DeleteMsgPopup from "./Popups/DeleteMsgPopoup";
import ReactMsgPopoup from "./Popups/ReactMsgPopoup";
import InfoPopup from "./Popups/InfoPopup";
import { REPLY_TO_MESSAGE } from "@/context/constants";

const MessageBox = ({ message, index }) => {
  const [{ currentChatUser, userInfo }, dispatch] = useStateProvider();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showReactPopup, setShowReactPopup] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const self = message?.senderId === currentChatUser?.id;
  

  const handleCopyMessage = () => {
    const messageText = message.message;
    if (messageText) {
      navigator.clipboard
        .writeText(messageText)
        .then(() => {
          toast.success("Message copied to clipboard", {
            autoClose: 1000,
          });
        })
        .catch((err) => {
          toast.error("Failed to copy message");
        });
    }
  };
  const handleMessageReact = ( emoji) => {
    console.log("react to ", emoji);
    // add api call here
  };

  const deleteMesasge = (action) => {};

  const options = [
    {
      name: "React Emoji",
      Icon: <MdOutlineAddReaction />,
      callback: () => {
        setShowReactPopup(true);
        setShowMenu(false);
      },
    },
    {
      name: "Reply",
      Icon: <MdOutlineReply />,
      callback: () => {
        dispatch({
          type:REPLY_TO_MESSAGE,
          data: {text: message.message, ReplyedMessageId:message.id, ReplyedUserId:message.senderId}
        });
        setShowMenu(false);
      },
    },
    {
      name: "Copy",
      Icon: <FaRegCopy />,
      callback: (message) => handleCopyMessage(message),
    },
    {
      name: "Delete",
      Icon: <MdDeleteOutline />,
      callback: () => {
        setShowDeletePopup(true);
        setShowMenu(false);
      },
    },
    {
      name: "Info",
      Icon: <MdOutlineInfo />,
      callback: () => {
        setShowInfoPopup(true);
        setShowMenu(false);
      },
    },
  ];

  return (
    <div className="group relative">
      <div>
        {message.type === "text" && <TextMessage message={message} />}
        {message.type === "image" && (
          <ImageMessage message={message} index={index} />
        )}
        {message.type === "audio" && <VoiceMessage message={message} />}
      </div>
      {showDeletePopup && (
        <DeleteMsgPopup
          onHide={() => setShowDeletePopup(false)}
          className="DeleteMsgPopup"
          noHeader={true}
          shortHeight={true}
          self={self}
          deleteMesasge={deleteMesasge}
          message={message}
        />
      )}
      {showReactPopup && (
        <ReactMsgPopoup
          onHide={() => setShowReactPopup(false)}
          className="ReactMsgPopup"
          noHeader={true}
          shortHeight={true}
          self={self}
          handleMessageReact={handleMessageReact}
          message={message}
        />
      )}
      {showInfoPopup && (
        <InfoPopup
          onHide={() => setShowInfoPopup(false)}
          className="InfoPopup"
          noHeader={true}
          shortHeight={true}
          self={self}
          message={message}
        />
      )}
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
};

export default MessageBox;
