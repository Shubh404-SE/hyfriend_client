import React, { useEffect, useState } from "react";
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
import DeleteMsgPopup from "../Popups/DeleteMsgPopoup";
import ReactMsgPopoup from "../Popups/ReactMsgPopoup";
import InfoPopup from "../Popups/InfoPopup";
import {
  DELETE_MESSAGE,
  REPLY_TO_MESSAGE,
  SET_REACTION,
} from "@/context/constants";
import ReplyedMessage from "./ReplyedMessage";
import axios from "axios";
import { ADD_MESSAGE_REACT_ROUTE, DELETED_MSG } from "@/utils/ApiRoutes";
import ReactedMessage from "./ReactedMessage";
import ReactDetails from "../Popups/ReactDetails";

const MessageBox = ({ message, index }) => {
  const [{ currentChatUser, userInfo, isOnSameChat, socket }, dispatch] =
    useStateProvider();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showReactPopup, setShowReactPopup] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [showReactDetailsPopup, setShowReactDetailsPopup] = useState(false);
  const [updatedMessage, setUpdatedMessage] = useState(message);
  const self = message?.senderId === currentChatUser?.id;

  useEffect(() => {
    setUpdatedMessage(message);
  }, [message]);

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

  const handleMessageReact = async (emoji) => {
    try {
      const response = await axios.post(ADD_MESSAGE_REACT_ROUTE, {
        messageId: message.id,
        userId: userInfo.id,
        reaction: emoji,
      });
      if (response.status === 201) {
        dispatch({
          type: SET_REACTION,
          reaction: response.data.reaction,
        });

        socket.current.emit("send-react-message", {
          contactId: currentChatUser.id,
          newReaction: {
            userId: userInfo.id,
            name: userInfo.name,
            messageId: message.id,
            reaction: emoji,
          },
        });
      }
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error(err);
      toast.error(err, {
        autoClose: 1000,
      });
    }
  };

  const deleteMesasge = async (action) => {
    try {
      const responce = await axios.post(DELETED_MSG, {
        messageId: message.id,
        userId: userInfo.id,
        type: action,
      });
      if (responce.status === 200) {
        toast.success(`${responce.data.message}`, {
          autoClose: 1000,
        });

        dispatch({
          type: DELETE_MESSAGE,
          data: { messageId: message.id },
        });

        if(action === "DELETED_FOR_EVERYONE"){
          socket.current.emit("delete-msg", {
            contactId: currentChatUser.id,
            messageId: message.id,
            userId: userInfo.id,
          })
        }
      }
      else{
        toast.error(responce.data.error, {
          autoClose:1000,
        });
      }

      setShowDeletePopup(false);
    } catch (err) {
      toast.error(err, {
        autoClose: 1000,
      });
      setShowDeletePopup(false);
    }
  };

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
          type: REPLY_TO_MESSAGE,
          data: {
            text: message.message,
            ReplyedMessageId: message.id,
            ReplyedUserId: message.senderId,
          },
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
        {message.replyToMessageId && <ReplyedMessage message={message} />}
        {message.type === "text" && <TextMessage message={message} />}
        {message.type === "image" && (
          <ImageMessage message={message} index={index} />
        )}
        {message.type === "audio" && <VoiceMessage message={message} />}
        {updatedMessage?.reactions?.length &&
        updatedMessage?.reactions[0]?.userId ? (
          <ReactedMessage
            reactions={updatedMessage.reactions}
            setShowReactPopup={setShowReactDetailsPopup}
          />
        ) : (
          <></>
        )}
      </div>
      {showReactDetailsPopup && (
        <ReactDetails
          onHide={() => setShowReactDetailsPopup(false)}
          className="React Details"
          noHeader={true}
          shortHeight={true}
          self={self}
          message={updatedMessage}
        />
      )}
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
