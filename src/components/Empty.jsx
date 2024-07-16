import Image from "next/image";
import React from "react";

function Empty() {
  return (
  <div className=" border-conversation-border border-l w-full bg-panel-header-background flex flex-col h-[100vh] border-b-4 border-b-icon-blue items-center justify-center">
    <Image src='/logo.png' alt="whatsapp" height={300} width={300} />
  </div>
);
}

export default Empty;
