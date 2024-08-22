import React from "react";
import TextMessage from "../message/TextMessage";
import ImageMessage from "../message/ImageMessage";
import dynamic from "next/dynamic";
const VoiceMessage = dynamic(() => import("../message/VoiceMessage"), { ssr: false });

const PopupWrapper = (props) => {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center select-none">
      <div
        className="w-full h-full absolute glass-effect"
        onClick={props.onHide}
      ></div>

      <div
        className={`relative z-10 flex flex-col items-center max-h-[80%] ml-[20%] m-2 ${
          props.shortHeight ? "" : "min-h-[600px]"
        } `}
        style={{ animation: "popup 0.3s ease-out forwards" }}
      >
        <div
          className={`absolute transform ${
            props.self ? "left-0 " : "right-0"
          } -translate-y-full -top-2`}
        >
          {props.message.type === "text" && (
            <TextMessage message={props.message} preview={true} />
          )}

          {props.message.type === "image" && (
            <ImageMessage message={props.message} index={1} preview={true} />
          )}

          {props.message.type === "audio" && (
            <VoiceMessage message={props.message} />
          )}
        </div>

        <div className="grow flex flex-col mb-5 ">{props.children}</div>
      </div>
    </div>
  );
};

export default PopupWrapper;
