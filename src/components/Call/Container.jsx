import { END_CALL } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import React, { useState } from "react";
import { MdOutlineCall } from "react-icons/md";

function Container({ data }) {
  const [{ socket, userInfo }, dispatch] = useStateProvider();
  const [callAccepted, setCallAccepted] = useState(false);

  // end call
  const endCall = () => {
    const id = data.id;
    if (data.callType === "voice") {
      socket.current.emit("reject-voice-call", {
        from: id,
      });
    } else {
      socket.current.emit("reject-video-call", {
        from: id,
      });
    }

    dispatch({
      type: END_CALL,
    });
  };

  return (
    <div className="border-conversation-border border-1 w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white">
      <div className="flex flex-col gap-3 items-center">
        <span className="text-5xl">{data.name}</span>
        <span className="text-lg">
          {callAccepted && data.callType !== "video"
            ? "On going call"
            : "Calling"}
        </span>
      </div>
      {(!callAccepted || data.callType === "audio") && (
        <div className="my-24">
          <Image
            className="rounded-full"
            src={data.profilePicture}
            alt="avatar"
            height={300}
            width={300}
          />
        </div>
      )}
      <div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full">
        <MdOutlineCall onClick={endCall} className="text-3xl cursor-pointer" />
      </div>
    </div>
  );
}

export default Container;
