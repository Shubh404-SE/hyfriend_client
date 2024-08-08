import React from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import {
  CHANGE_CURRENT_CHAT_USER,
  SET_ALL_CONTACTS_PAGE,
} from "@/context/constants";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { FaCamera, FaMicrophone } from "react-icons/fa";

function ChatListItem({ data, isContactPage }) {
  const [{ userInfo, isTyping, onlineUsers, currentChatUser }, dispatch] =
    useStateProvider();
  const handleContactClick = () => {
    if (!isContactPage) {
      dispatch({
        type: CHANGE_CURRENT_CHAT_USER,
        user: {
          name: data.name,
          about: data.about,
          profilePicture: data.profilePicture,
          email: data.email,
          id: userInfo.id === data.senderId ? data.recieverId : data.senderId,
        },
      });
    } else {
      dispatch({
        type: CHANGE_CURRENT_CHAT_USER,
        user: { ...data },
      });
      dispatch({
        type: SET_ALL_CONTACTS_PAGE,
      });
    }
  };

  return (
    <div
      className={`flex cursor-pointer items-center ${currentChatUser && currentChatUser.id === data.recieverId ? "bg-conversation-panel-background":""} hover:bg-background-default-hover`}
      onClick={handleContactClick}
    >
      <div className="min-w-fit px-5 pt-3 pb-1 relative">
        <Avatar type="lg" image={data?.profilePicture} />
       { onlineUsers.includes(data.id) &&
        <span className="w-3 h-3 bg-green-500 absolute bottom-1 right-6 rounded-full"></span>}
      </div>
      <div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full">
        <div className="flex justify-between">
          <div>
            <span className="text-white">{data?.name}</span>
          </div>
          {!isContactPage && (
            <div>
              <span
                className={`${
                  !(data.totalUnreadMessages > 0)
                    ? "text-secondary"
                    : "text-icon-blue"
                } text-sm`}
              >
                {calculateTime(data.createdAt)}
              </span>
            </div>
          )}
        </div>
        <div className="flex border-b border-conversation-border pb-2 pt-1 pr-2">
          <div className="flex justify-between w-full relative">
            <span className="text-secondary line-clamp-1 text-sm">
              {isContactPage ? (
                data?.about || "\u00A0"
              ) : (
                <div className="flex items-center gap-1 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[300px] relative">
                  {data.senderId === userInfo.id && !isTyping[data.id] && (
                    <MessageStatus messageStatus={data.messageStatus} />
                  )}
                  {isTyping[data.id] ? (
                    <div className="flex items-center min-w-[5rem]">
                      <div className="relative">
                        <span>Typing</span>
                        <img
                          src="/typing.svg"
                          alt="Typing..."
                          className="absolute -top-1 -right-full"
                        />
                      </div>
                    </div>
                  ) : (
                    data.type === "text" && (
                      <span className="truncate">{data.message}</span>
                    )
                  )}
                  {data.type === "audio" && (
                    <span className="flex gap-1 items-center">
                      <FaMicrophone className="text-panel-header-icon" />
                      Audio
                    </span>
                  )}
                  {data.type === "image" && (
                    <span className="flex gap-1 items-center">
                      <FaCamera className="text-panel-header-icon" />
                      Image
                    </span>
                  )}
                </div>
              )}
            </span>
            {data.totalUnreadMessages > 0 && (
              <span className="bg-icon-blue px-[5px] rounded-full text-sm">
                {data.totalUnreadMessages}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatListItem;
