import React from "react";
import PopupWrapper from "./PopupWrapper";
import { MdCheckCircle, MdSend } from "react-icons/md";
import { BsCheck, BsCheckAll } from "react-icons/bs";
import { calculateTime } from "@/utils/CalculateTime";

const InfoPopup = (props) => {
  return (
    <PopupWrapper {...props}>
      <div className="flex flex-col items-center justify-center gap-6 bg-panel-header-background p-6 rounded-lg">
        <div className="flex items-center gap-4 text-gray-600">
          <div className="text-gray-600">Message sent</div>
          <div className="flex items-center mr-2">
            <span className="">{calculateTime(props.message.createdAt)}</span>
            <BsCheck className=" text-panel-header-icon cursor-pointer text-xl" />
          </div>
        </div>
        <div className="flex items-center gap-4 text-blue-400">
          <div className="text-gray-600">Message seen</div>
          <div className="flex items-center gap-2 mr-2">
            <span className="">{calculateTime(props.message.seenAt? props.message.seenAt:"")}</span>
            <BsCheckAll className="  cursor-pointer text-xl" />
          </div>
        </div>
      </div>
    </PopupWrapper>
  );
};

export default InfoPopup;
