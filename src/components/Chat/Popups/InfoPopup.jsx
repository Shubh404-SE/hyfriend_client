import React from "react";
import PopupWrapper from "./PopupWrapper";
import { MdCheckCircle, MdSend } from "react-icons/md";

const InfoPopup = (props) => {
  return (
    <PopupWrapper {...props}>
      <div className="flex items-center justify-center gap-6 bg-panel-header-background p-6 rounded-lg">
        <div className="flex items-center mr-2">
          <span className="text-gray-600">11.02</span>
          <MdSend className="text-gray-400 ml-1" />
        </div>
        <div className="flex items-center animate-pulse">
          <span className="text-green-500">15.25</span>
          <MdCheckCircle className="text-green-400 ml-1" />
        </div>
      </div>
    </PopupWrapper>
  );
};

export default InfoPopup;
