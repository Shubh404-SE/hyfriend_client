import React, { useEffect, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import {
  ADD_MESSAGE,
  END_CALL,
  SET_INCOMING_VIDEO_CALL,
  SET_INCOMING_VOICE_CALL,
  SET_MESSAGES,
  SET_ONLINE_USERS,
  SET_SOCKET,
  SET_USER_INFO,
} from "@/context/constants";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client";
import SearchMessages from "./Chat/SearchMessages";
import VoiceCall from "./Call/VoiceCall";
import VideoCall from "./Call/VideoCall";
import IncomingVideoCall from "./common/IncomingVideoCall";
import IncomingCall from "./common/IncomingCall";

function Main() {
  const router = useRouter();
  const [
    {
      userInfo,
      currentChatUser,
      messagesSearch,
      voiceCall,
      incomingVoiceCall,
      videoCall,
      incomingVideoCall,
    },
    dispatch,
  ] = useStateProvider(); // statereducers
  const socket = useRef(); // to maintain socket
  // const [redirectLogin, setRedirectLogin] = useState(false);
  const [socketEvent, setSocketEvent] = useState(false);

 useEffect(()=>{
  if(!userInfo) router.push("/login");
 }, [userInfo]);

  // check login user in realtime.
  onAuthStateChanged(firebaseAuth, async (currentUser) => {

    if (!userInfo && currentUser?.email) {
      const { data } = await axios.post(CHECK_USER_ROUTE, {
        email: currentUser.email,
      });

      if (data.data) {
        const {
          id,
          name,
          email,
          profilePicture: profileImage,
          status,
        } = data.data;
        
        dispatch({
          type: SET_USER_INFO,
          userInfo: {
            id,
            name,
            email,
            profileImage,
            status,
          },
        });
      }
    }
  });

  // connecting to socket
  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST);
      socket.current.emit("add-user", userInfo.id);
      dispatch({
        type: SET_SOCKET,
        socket,
      });
    }
  }, [userInfo]);

  // sockets for messages and calling
  useEffect(() => {
    if (socket.current && !socketEvent) {
      // recieving "msg-recieve" socket with data {from, to, message}

      socket.current.on("msg-recieve", (data) => {
        dispatch({
          type: ADD_MESSAGE,
          newMessage: {
            ...data.message,
          },
        });
      });

      // recieving socket for incoming calls
      socket.current.on("incoming-voice-call", ({ from, roomId, callType }) => {
        dispatch({
          type: SET_INCOMING_VOICE_CALL,
          incomingVoiceCall: { ...from, roomId, callType },
        });
      });

      socket.current.on("incoming-video-call", ({ from, roomId, callType }) => {
        dispatch({
          type: SET_INCOMING_VIDEO_CALL,
          incomingVideoCall: { ...from, roomId, callType },
        });
      });

      // sockets for rejecting calls
      socket.current.on("voice-call-rejected", () => {
        dispatch({ type: END_CALL });
      });
      socket.current.on("video-call-rejected", () => {
        dispatch({ type: END_CALL });
      });

      // online/ offline
      socket.current.on("online-users", ({ onlineUsers }) => {
        dispatch({ type: SET_ONLINE_USERS, onlineUsers });
      });

      setSocketEvent(true);
    }
  }, [socket.current]);

  // getting messages of selected user
  useEffect(() => {
    const getMessages = async () => {
      // console.log(userInfo.id, currentChatUser.id);
      const {
        data: { messages },
      } = await axios.get(
        `${GET_MESSAGES_ROUTE}/${userInfo.id}/${currentChatUser.id}`
      );

      dispatch({
        type: SET_MESSAGES,
        messages,
      });
    };
    if (currentChatUser?.id) {
      getMessages();
    }
  }, [currentChatUser]);

  return (
    <>
      {incomingVideoCall && <IncomingVideoCall />}
      {incomingVoiceCall && <IncomingCall />}
      {voiceCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VoiceCall />
        </div>
      )}
      {videoCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VideoCall />
        </div>
      )}
      {!videoCall && !voiceCall && (
        <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
          <ChatList />
          {currentChatUser ? (
            <div
              className={`${
                messagesSearch ? "grid grid-cols-2" : "grid-cols-2"
              }`}
            >
              <Chat />
              {messagesSearch && <SearchMessages />}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      )}
    </>
  );
}

export default Main;
