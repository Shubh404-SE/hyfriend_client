import React from "react";
import TextMessage from "../TextMessage";
import ImageMessage from "../ImageMessage";
import dynamic from "next/dynamic";
const VoiceMessage = dynamic(() => import("../VoiceMessage"), { ssr: false });

const PopupWrapper = (props) => {
  return (
    <div className="fixed top-0 right-0 z-20 w-full h-full flex items-center justify-center">
      <div
        className="w-full h-full absolute glass-effect"
        onClick={props.onHide}
      ></div>

      <div
        className={`flex flex-col max-h-[80%] bg-panel-header-background relative z-10 rounded-3xl ${
          props.shortHeight ? "" : " min-h-[600px]"
        }`}
      >
        <div
          className={`absolute ${
            props.self ? "left-0" : "right-0"
          } -translate-y-full -top-2`}
        >
          {props.message.type === "text" && (
            <TextMessage message={props.message} />
          )}
          {props.message.type === "image" && (
            <ImageMessage message={props.message} />
          )}
          {props.message.type === "audio" && (
            <VoiceMessage message={props.message} />
          )}
        </div>

        <div className="grow flex flex-col p-6 pt-0">{props.children}</div>
      </div>
    </div>
  );
};

export default PopupWrapper;
