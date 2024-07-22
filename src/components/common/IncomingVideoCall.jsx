import { useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import React, { useState } from "react";

function IncomingVideoCall() {

  const [{incomingVideoCall}, dispatch] = useStateProvider();

  const acceptCall = () =>{

  }
  const rejectCall =()=>{

  }
  return <div className="h-24 w-80 fixed bottom-8 mb-0 right-6 z-50 rounded-sm flex gap-5 items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-icon-blue border-2 py-14">
    <div>
      <Image src={incomingVideoCall.profilePicture} alt="Avatar"  width={70} height={70} className="rounded-full"/>
    </div>
    <div>
      <div>
        {incomingVideoCall.name}
      </div>
      <div className="text-xs">Incoming Video Call</div>
      <div className="flex gap-2 mt-2">
        <button onClick={rejectCall} className="bg-red-500 p-1 px-3 text-sm rounded-full" >Reject</button>
        <button onClick={acceptCall} className="bg-blue-800 p-1 px-3 text-sm rounded-full" >Accept</button>
      </div>
    </div>
  </div>;
}

export default IncomingVideoCall;
