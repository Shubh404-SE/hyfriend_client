import { useStateProvider } from "@/context/StateContext";
import React from "react";

const ReactedMessage = ({ reactions }) => {
  const [{ userInfo, currentChatUser }] = useStateProvider();
  return (
    <div className="-mt-4 flex items-center gap-1 text-xl select-none cursor-pointer text-white">
      <div className="flex justify-center items-center">
        {reactions[0].reaction}{reactions[1]?.reaction}
      </div>
    </div>
  );
};

export default ReactedMessage;
