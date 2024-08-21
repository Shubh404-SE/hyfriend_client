import React from "react";
import PopupWrapper from "./PopupWrapper";
import { useStateProvider } from "@/context/StateContext";
import Avatar from "@/components/common/Avatar";

const ReactDetails = (props) => {
  const { message } = props;
  const [{ currentChatUser, userInfo }] = useStateProvider();
  return (
    <PopupWrapper {...props}>
      <div className="bg-panel-header-background p-2 rounded-md w-full min-w-64 flex flex-col gap-3 justify-center">
        {message.reactions.map((react, index) => {
          const user =
            react.userId === currentChatUser.id ? currentChatUser : userInfo;
          return (
            <div
              key={index}
              className={`flex cursor-pointer items-center bg-conversation-panel-background hover:bg-background-default-hover`}
              //   onClick={handleContactClick} // add onclick to remove this reaction.
            >
              <div className="min-w-fit px-5 pt-3 pb-1 relative">
                <Avatar
                  type="sm"
                  image={user.profilePicture || user.profileImage}
                />
              </div>
              <div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full">
                <div className="flex gap-6 justify-between">
                  <div>
                    <span className="text-white">{user.id === userInfo.id ? "You" : user?.name}</span>
                  </div>
                  <div>{react.reaction}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PopupWrapper>
  );
};

export default ReactDetails;
