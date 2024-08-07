import { ADD_MESSAGE } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdDeleteForever, MdSend } from "react-icons/md";
import PhotoPicker from "../common/PhotoPicker";
import dynamic from "next/dynamic";
const CaptureAudio = dynamic(() => import("../common/CaptureAudio"), {
  ssr: false,
});

function MessageBar() {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [photoMessage, setPhotoMessage] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const emojiPickerRef = useRef(null);


  const photoPickerChange = (e) => {
    const file = e.target.files[0];
    setPhotoMessage(file);
    if (file) {
      const blockurl = URL.createObjectURL(file); // by default browser url api
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

  // handle outside click for emoji picker
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
    setMessage((prev) => (prev += emoji.emoji));
  };

  // send image
  const sendPhotoMessage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const responce = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: userInfo.id,
          to: currentChatUser.id,
        },
      });

      if (responce.status === 201) {
        socket.current.emit("send-msg", {
          to: currentChatUser?.id,
          from: userInfo?.id,
          message: responce.data.message,
        });

        dispatch({
          type: ADD_MESSAGE,
          newMessage: {
            ...responce.data.message,
          },
          fromSelf: true,
        });

        setAttachmentPreview(null);
        setPhotoMessage(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // send message
  const sendMessage = async () => {
    if (message) {
      console.log(message);
      try {
        const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
          to: currentChatUser.id,
          from: userInfo.id,
          message,
        });
        socket.current.emit("send-msg", {
          to: currentChatUser?.id,
          from: userInfo?.id,
          message: data.message,
        });

        dispatch({
          type: ADD_MESSAGE,
          newMessage: {
            ...data.message,
          },
          fromSelf: true,
        });
        setMessage("");
      } catch (err) {
        console.log(err);
      }
    } else if (photoMessage) {
      sendPhotoMessage(photoMessage);
    }
  };
  return (
    <div className=" bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
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
              onChange={(e) => setMessage(e.target.value)}
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
      {grabPhoto && (
        <PhotoPicker onChange={photoPickerChange} />
      )}
      {showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder} />}
    </div>
  );
}

export default MessageBar;
