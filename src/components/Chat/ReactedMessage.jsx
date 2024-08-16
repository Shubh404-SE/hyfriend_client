import { useStateProvider } from "@/context/StateContext";
import React from "react";

const ReactedMessage = ({ reactions }) => {
  const [{ userInfo, currentChatUser }] = useStateProvider();
  return (
    <div className="-mt-4 flex items-center gap-1 text-xl select-none cursor-pointer text-white">
      <div className="flex justify-center items-center">
        {reactions[0].reaction}{" "}
        <span className="text-sm font-bold">{reactions.length - 1 > 0 ? reactions.length - 1 : ""}</span>
      </div>
    </div>
  );
};

export default ReactedMessage;
