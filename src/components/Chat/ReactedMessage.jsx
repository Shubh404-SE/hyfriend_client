import React, { useEffect, useState } from "react";
import { useStateProvider } from "@/context/StateContext";

const ReactedMessage = ({ reactions }) => {
  const [{ userInfo, currentChatUser }] = useStateProvider();
  const [animatedReactions, setAnimatedReactions] = useState([]);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    setAnimatedReactions(reactions);

    const timer = setTimeout(() => {
      setAnimate(false);
    }, 300); 

    return () => clearTimeout(timer);
  }, [reactions]);

  return (
    <div className="-mt-1 ml-auto flex items-center gap-1 text-xl select-none cursor-pointer text-white">
      <div className="flex justify-center items-center">
        {animatedReactions.slice(0, 2).map((reaction, index) => (
          <div
            key={index}
            className={` bg-panel-header-background rounded-full flex items-center justify-center shadow-md transform transition-transform duration-200 ease-in-out emoji-3d hover:scale-110 ${
              animate ? "animate-reaction" : ""
            }`}
          >
            <span className="text-lg">{reaction.reaction}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReactedMessage;
