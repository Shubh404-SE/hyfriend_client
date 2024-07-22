import {
  END_CALL,
  SET_INCOMING_VOICE_CALL,
  SET_VOICE_CALL,
} from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import React from "react";

function IncomingCall() {
  const [{ incomingVoiceCall, socket }, dispatch] = useStateProvider();

  const acceptCall = () => {
    dispatch({
      type: SET_VOICE_CALL,
      voiceCall: { ...incomingVoiceCall, type: "in-coming" },
    });
    socket.current.emit("accept-incoming-call", { id: incomingVoiceCall.id });
    dispatch({
      type: SET_INCOMING_VOICE_CALL,
      incomingVoiceCall: undefined,
    });
  };
  const rejectCall = () => {
    socket.current.emit("reject-video-call", { from: incomingVoiceCall.id });
    dispatch({
      type: END_CALL,
    });
  };
  return (
    <div className="h-24 w-80 fixed bottom-8 mb-0 right-6 z-50 rounded-sm flex gap-5 items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-icon-blue border-2 py-14">
      <div>
        <Image
          src={incomingVoiceCall.profilePicture}
          alt="Avatar"
          width={70}
          height={70}
          className="rounded-full"
        />
      </div>
      <div>
        <div>{incomingVoiceCall.name}</div>
        <div className="text-xs">Incoming Voice Call</div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={rejectCall}
            className="bg-red-500 p-1 px-3 text-sm rounded-full"
          >
            Reject
          </button>
          <button
            onClick={acceptCall}
            className="bg-blue-800 p-1 px-3 text-sm rounded-full"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomingCall;
