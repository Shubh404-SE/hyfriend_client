import { useStateProvider } from "@/context/StateContext";
import React, { useEffect, useRef, useState } from "react";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import MessageBox from "./message/MessageBox";

function ChatContainer() {
  const [{ messages, currentChatUser, userInfo }] = useStateProvider();
  const ref = useRef();
  const [prevMessagesLength, setPrevMessagesLength] = useState(Object.keys(messages).length);

  useEffect(() => {
    const scrollToBottom = () => {
      const chatContainer = ref.current;
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    };
    if (Object.keys(messages).length > prevMessagesLength) {
      setTimeout(() => {
        scrollToBottom();
      }, 0);
    }

    setPrevMessagesLength(Object.keys(messages).length);
  }, [messages, currentChatUser, userInfo]);


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
              {Object.values(messages).map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === currentChatUser.id
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <MessageBox message={message} index={index} />
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
