import {
  ADD_MESSAGE,
  REPLY_TO_MESSAGE,
  SET_USER_CONTACTS,
  UPDATE_USER_CONTACTS_ON_SEND,
} from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdDeleteForever, MdOutlineReply, MdSend } from "react-icons/md";
import PhotoPicker from "../common/PhotoPicker";
import dynamic from "next/dynamic";
import Avatar from "../common/Avatar";
import { IoCloseCircleOutline } from "react-icons/io5";
const CaptureAudio = dynamic(() => import("../common/CaptureAudio"), {
  ssr: false,
});

function MessageBar() {
  const [
    {
      userInfo,
      currentChatUser,
      isOnSameChat,
      socket,
      isTyping,
      replyingToMessage,
    },
    dispatch,
  ] = useStateProvider();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [photoMessage, setPhotoMessage] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const emojiPickerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const photoPickerChange = (e) => {
    const file = e.target.files[0];
    setPhotoMessage(file);
    if (file) {
      const blockurl = URL.createObjectURL(file);
      setAttachmentPreview(blockurl);
      console.log(blockurl);
    }
  };

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [grabPhoto]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id !== "emoji-open") {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(event.target)
        ) {
          setShowEmojiPicker(false);
        }
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleEnterKeyPress = (event) => {
      if (event.key === "Enter") {
        sendMessage();
      }
    };

    document.addEventListener("keydown", handleEnterKeyPress);

    return () => {
      document.removeEventListener("keydown", handleEnterKeyPress);
    };
  }, [message, photoMessage]);

  const handleEmojiModel = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!isTypingRef.current && message) {
      isTypingRef.current = true;
      socket.current.emit("startTyping", {
        to: currentChatUser.id,
        from: userInfo.id,
      });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      socket.current.emit("stopTyping", {
        to: currentChatUser.id,
        from: userInfo.id,
      });
    }, 3000); // 3 seconds after the last keystroke
  };

  const handleBlur = () => {
    isTypingRef.current = false;
    socket.current.emit("stopTyping", {
      to: currentChatUser.id,
      from: userInfo.id,
    });
  };

  const sendPhotoMessage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: userInfo.id,
          to: currentChatUser.id,
        },
      });

      if (response.status === 201) {
        socket.current.emit("send-msg", {
          to: currentChatUser?.id,
          from: userInfo?.id,
          message: response.data.message,
        });

        if (isOnSameChat) {
          const newMessage = {
            ...response.data.message,
            messageStatus: "read",
            seenAt: new Date(),
          };
          const newData = { ...response.data, message: newMessage };
          dispatch({
            type: UPDATE_USER_CONTACTS_ON_SEND,
            data: newData,
          });

          dispatch({
            type: ADD_MESSAGE,
            newMessage,
            fromSelf: true,
          });
        } else {
          dispatch({
            type: UPDATE_USER_CONTACTS_ON_SEND,
            data: response.data,
          });

          dispatch({
            type: ADD_MESSAGE,
            newMessage: {
              ...response.data.message,
            },
            fromSelf: true,
          });
        }

        setAttachmentPreview(null);
        setPhotoMessage(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = async () => {
    if (message) {
      try {
        const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
          to: currentChatUser.id,
          from: userInfo.id,
          message,
          replyToMessageId: replyingToMessage
            ? replyingToMessage.ReplyedMessageId
            : null,
          ReplyedUserId: replyingToMessage
            ? replyingToMessage.ReplyedUserId
            : null,
        });

        if (replyingToMessage) {
          data.message.repliedmessage = replyingToMessage.text;
        }
        data.message.reactions = [];

        dispatch({
          type: REPLY_TO_MESSAGE,
          data: undefined,
        });
        socket.current.emit("send-msg", {
          to: currentChatUser?.id,
          from: userInfo?.id,
          message: data.message,
        });

        if (isOnSameChat) {
          const newMessage = { ...data.message, messageStatus: "read",seenAt: new Date(), };
          const newData = { ...data, message: newMessage };
          dispatch({
            type: UPDATE_USER_CONTACTS_ON_SEND,
            data: newData,
          });

          dispatch({
            type: ADD_MESSAGE,
            newMessage,
            fromSelf: true,
          });
        } else {
          dispatch({
            type: UPDATE_USER_CONTACTS_ON_SEND,
            data: data,
          });

          dispatch({
            type: ADD_MESSAGE,
            newMessage: {
              ...data.message,
            },
            fromSelf: true,
          });
        }

        setMessage("");
        isTypingRef.current = false;
        socket.current.emit("stopTyping", {
          to: currentChatUser.id,
          from: userInfo.id,
        });
      } catch (err) {
        console.log(err);
      }
    } else if (photoMessage) {
      sendPhotoMessage(photoMessage);
    }
  };

  return (
    <div className="flex flex-col w-full justify-center">
      {replyingToMessage && (
        <div className="flex items-end bg-panel-header-background/95 h-20">
          <div className="flex items-center h-16 bg-icon-lighter border-r-2 border-l-4 border-t-2 border-white border-l-teal-light w-full ml-24 mr-5 rounded-t-lg">
            <div className="p-4 flex flex-col justify-center gap-2">
              <div className="flex items-center gap-3">
                <MdOutlineReply />
                <span
                  className={`font-semibold text-base ${
                    message.senderId === currentChatUser.id
                      ? " text-incoming-background"
                      : "text-outgoing-background"
                  }`}
                >
                  {replyingToMessage.ReplyedUserId === currentChatUser.id
                    ? currentChatUser.name
                    : "You"}
                </span>
              </div>
              <div className="text-sm font-normal max-h-3 text-wrap">
                {replyingToMessage.text}
              </div>
            </div>
            <div
              className="ml-auto mr-4 text-xl cursor-pointer z-50"
              onClick={() => {
                dispatch({
                  type: REPLY_TO_MESSAGE,
                  data: undefined,
                });
              }}
            >
              <IoCloseCircleOutline className=" text-panel-header-background cur" />
            </div>
          </div>
        </div>
      )}
      <div className=" bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
        {isTyping[currentChatUser.id] && (
          <div className="absolute bottom-16 left-2 ">
            <div className="flex items-center justify-center w-fit">
              <Avatar
                type="sm"
                image={`${
                  currentChatUser
                    ? currentChatUser.profilePicture
                    : "/default_avatar.png"
                }`}
              />
              <img
                src="/typing.svg"
                alt="Typing..."
                className="typing-indicator"
              />
            </div>
          </div>
        )}
        {attachmentPreview && (
          <div className=" absolute w-[250px] h-[250px] bottom-16 left-0 bg-panel-header-background p-2 rounded-md">
            <img src={attachmentPreview} alt="" className=" w-full h-full" />
            <div
              className=" w-6 h-6 rounded-full bg-red-500 flex justify-center items-center absolute -right-2 -top-2 cursor-pointer"
              onClick={() => {
                setPhotoMessage(null);
                setAttachmentPreview(null);
              }}
            >
              <MdDeleteForever />
            </div>
          </div>
        )}
        {!showAudioRecorder && (
          <>
            <div className=" flex gap-6">
              <BsEmojiSmile
                className=" text-panel-header-icon cursor-pointer text-xl"
                title="Emoji"
                id="emoji-open"
                onClick={handleEmojiModel}
              />
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className=" absolute bottom-24 left-16 z-40"
                >
                  <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
                </div>
              )}
              <ImAttachment
                className=" text-panel-header-icon cursor-pointer text-xl"
                title="Attach File"
                onClick={() => setGrabPhoto(true)}
              />
            </div>
            <div className=" w-full rounded-lg h-10 flex items-center">
              <input
                type="text"
                placeholder="Type a message"
                onChange={handleTyping}
                onBlur={handleBlur}
                value={message}
                className=" bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
              />
            </div>
            <div className="flex w-10 items-center justify-center">
              <button className="flex">
                {message.length || photoMessage ? (
                  <MdSend
                    className=" text-panel-header-icon cursor-pointer text-xl"
                    title="Send message"
                    onClick={sendMessage}
                  />
                ) : (
                  <FaMicrophone
                    className=" text-panel-header-icon cursor-pointer text-xl"
                    title="Record"
                    onClick={() => setShowAudioRecorder(true)}
                  />
                )}
              </button>
            </div>
          </>
        )}
        {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
        {showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder} />}
      </div>
    </div>
  );
}

export default MessageBar;
