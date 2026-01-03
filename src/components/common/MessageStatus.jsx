import React from "react";
import { BsCheck, BsCheckAll } from "react-icons/bs";

function MessageStatus({messageStatus}) {
  return (
    <>
    {messageStatus === "sent" && <BsCheck className=" text-panel-header-icon cursor-pointer text-xl" />}
    {messageStatus === "delivered" && <BsCheckAll className=" text-panel-header-icon cursor-pointer text-xl" />}
    {messageStatus === "read" && <BsCheckAll className=" text-blue-400 cursor-pointer text-xl" />}
    </>
  );
}

export default MessageStatus;
