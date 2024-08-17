import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import { calculateTime } from "@/utils/CalculateTime";
import Image from "next/image";
import React from "react";
import MessageStatus from "../../common/MessageStatus";
import { PhotoView } from "react-photo-view";

function ImageMessage({ message, index, preview }) {
  const [{ currentChatUser, userInfo }] = useStateProvider();

  return (
    <>
      {!preview ? (
        <div
          className={`p-1 rounded-lg ${
            message.senderId === currentChatUser.id
              ? " bg-incoming-background"
              : "bg-outgoing-background"
          }`}
        >
          <div className="relative group">
            <PhotoView key={index} src={`${HOST}/${message.message}`}>
              <Image
                src={`${HOST}/${message.message}`}
                className=" rounded-lg cursor-pointer"
                alt="asset"
                height={300}
                width={300}
              />
            </PhotoView>
            <div className=" absolute bottom-1 right-1 flex items-end gap-1">
              <span className=" text-bubble-meta text-[11px] pt-1 min-w-fit">
                {calculateTime(message.createdAt)}
              </span>
              <span className=" text-bubble-meta">
                <span className=" text-bubble-meta">
                  {message.senderId === userInfo.id && (
                    <MessageStatus messageStatus={message.messageStatus} />
                  )}
                </span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`p-1 rounded-lg bg-transparent ${
            message.senderId === currentChatUser.id
              ? "bg-incoming-background"
              : "bg-outgoing-background"
          }`}
        >
          <div className="relative group">
            <div className="relative h-[150px] w-[150px] rounded-lg overflow-hidden">
              <PhotoView key={index} src={`${HOST}/${message.message}`}>
                <Image
                  src={`${HOST}/${message.message}`}
                  className="object-contain w-full h-full rounded-lg cursor-pointer"
                  alt="asset"
                  height={150}
                  width={150}
                />
              </PhotoView>
            </div>
            <div className="absolute bottom-1 right-1 flex items-end gap-1">
              <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                {calculateTime(message.createdAt)}
              </span>
              {message.senderId === userInfo.id && (
                <span className="text-bubble-meta">
                  <MessageStatus messageStatus={message.messageStatus} />
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ImageMessage;
