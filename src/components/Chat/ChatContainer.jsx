import { useStateProvider } from "@/context/StateContext";
import React, { useEffect, useRef, useState } from "react";
import ImageMessage from "./ImageMessage";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import dynamic from "next/dynamic";
import {
  MdDeleteOutline,
  MdOutlineAddReaction,
  MdOutlineInfo,
  MdOutlineReply,
} from "react-icons/md";
import { FaRegCopy } from "react-icons/fa";
import TextMessage from "./TextMessage";
const VoiceMessage = dynamic(() => import("./VoiceMessage"), { ssr: false });

function ChatContainer() {
  const [{ messages, currentChatUser, userInfo }] = useStateProvider();
  const ref = useRef();

  useEffect(() => {
    const scrollToBottom = () => {
      const chatcontainer = ref.current;
      chatcontainer.scrollTop = chatcontainer.scrollHeight;
    };

    setTimeout(() => {
      scrollToBottom();
    }, 0);
  }, [currentChatUser, userInfo, messages]);

  const handleMessageReply = (message) => {
    console.log("reply to ", message);
  };
  const handleCopyMessage = (message) => {
    console.log("copy to ", message);
  };
  const handleMessageDelete = (message) => {
    console.log("delete to ", message);
  };
  const handleMessageReact = (message) => {
    console.log("react to ", message);
  };
  const handleMessageInfo = (message) => {
    console.log("info to ", message);
  };

  const options = [
    {
      name: "React Emoji",
      Icon: <MdOutlineAddReaction />,
      callback: (message) => handleMessageReact(message),
    },
    {
      name: "Reply",
      Icon: <MdOutlineReply />,
      callback: (message) => handleMessageReply(message),
    },
    {
      name: "Copy",
      Icon: <FaRegCopy />,
      callback: (message) => handleCopyMessage(message),
    },
    {
      name: "Delete",
      Icon: <MdDeleteOutline />,
      callback: (message) => handleMessageDelete(message),
    },
    {
      name: "Info",
      Icon: <MdOutlineInfo />,
      callback: (message) => handleMessageInfo(message),
    },
  ];

  return (
    <div
      ref={ref}
      className="h-[80vh] w-full grow overflow-auto custom-scrollbar"
    >
      <div className=" bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0"></div>
      <div className="mx-8 my-6 relative bottom-0 left-0  z-0">
        <div className="flex w-full">
          <PhotoProvider
            speed={() => 500}
            easing={(type) =>
              type === 2
                ? "cubic-bezier(0.36, 0, 0.66, -0.56)"
                : "cubic-bezier(0.34, 1.56, 0.64, 1)"
            }
          >
            <div className="grow  flex flex-col gap-1">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === currentChatUser.id
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  {message.type === "text" && (
                    <TextMessage message={message} options={options} />
                  )}
                  {message.type === "image" && (
                    <ImageMessage
                      message={message}
                      index={index}
                      options={options}
                    />
                  )}
                  {message.type === "audio" && (
                    <VoiceMessage message={message} options={options} />
                  )}
                </div>
              ))}
            </div>
          </PhotoProvider>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
