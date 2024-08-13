import React, { useEffect, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import ToastMessage from "./common/ToastMessage";
import { toast } from "react-toastify";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import {
  ADD_MESSAGE,
  CHANGE_CURRENT_CHAT_USER,
  END_CALL,
  IS_ON_SAME_CHAT,
  SET_INCOMING_VIDEO_CALL,
  SET_INCOMING_VOICE_CALL,
  SET_IS_TYPING,
  SET_MESSAGES,
  SET_NOT_TYPING,
  SET_ONLINE_USERS,
  SET_SOCKET,
  SET_USER_INFO,
  UPDATE_MESSAGE_STATUS,
  UPDATE_USER_CONTACTS_ON_RECEIVE,
} from "@/context/constants";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client";
import SearchMessages from "./Chat/SearchMessages";
import VoiceCall from "./Call/VoiceCall";
import VideoCall from "./Call/VideoCall";
import IncomingVideoCall from "./common/IncomingVideoCall";
import IncomingCall from "./common/IncomingCall";
import PermissionModal from "./common/PermissionModal";
import UserProfile from "./common/UserProfile";

function Main() {
  const router = useRouter();
  const [
    {
      userInfo,
      currentChatUser,
      messagesSearch,
      userContacts,
      isOnSameChat,
      profilePage,
      voiceCall,
      incomingVoiceCall,
      videoCall,
      incomingVideoCall,
    },
    dispatch,
  ] = useStateProvider(); // statereducers
  const socket = useRef(); // to maintain socket
  const currentChatUserRef = useRef(); // to check currentChatUser inside sockets.
  const audioRef = useRef(); // notification
  const allowSoundRef = useRef(null); // To keep track of allowSound state
  // const [redirectLogin, setRedirectLogin] = useState(false);
  const [socketEvent, setSocketEvent] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  useEffect(() => {
    console.log("hello");
    const chatUser = localStorage.getItem("currentChatUser");
    if (chatUser) {
      dispatch({
        type: CHANGE_CURRENT_CHAT_USER,
        user: JSON.parse(chatUser),
      });
    }
  }, [dispatch]);

  useEffect(() => {
    if (!userInfo) router.push("/login");
  }, [userInfo]);

  useEffect(() => {
    currentChatUserRef.current = currentChatUser; // Update ref whenever currentChatUser changes
  }, [currentChatUser]);

  // sound play interection
  useEffect(() => {
    const userSoundPreference = JSON.parse(localStorage.getItem("allowSound"));
    if (userSoundPreference === null) {
      setShowPermissionModal(true);
    } else {
      allowSoundRef.current = userSoundPreference; // Update ref
    }
  }, [showPermissionModal]);

  const handleAllowSound = () => {
    allowSoundRef.current = true; // Update ref
    localStorage.setItem("allowSound", JSON.stringify(true));
    setShowPermissionModal(false);
  };

  const handleDenySound = () => {
    allowSoundRef.current = false; // Update ref
    localStorage.setItem("allowSound", JSON.stringify(false));
    setShowPermissionModal(false);
  };

  // play notification sound
  const playNotificationSound = () => {
    if (allowSoundRef.current && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Failed to play audio:", error);
      });
    }
  };

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
          about,
        } = data.data;

        dispatch({
          type: SET_USER_INFO,
          userInfo: {
            id,
            name,
            email,
            profileImage,
            status: about,
          },
        });
      }
    }
  });

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
    if (currentChatUser?.id && userInfo?.id) {
      getMessages();
    }
  }, [currentChatUser]);

  // connecting to socket
  useEffect(() => {
    if (userInfo) {
      socket.current = io(
        HOST
        //   ,{
        //   // chatgpt suggested
        //   reconnection: true, // Default: true, but ensure it's enabled
        //   reconnectionAttempts: Infinity, // Default: Infinity, try forever until connected
        //   reconnectionDelay: 1000, // Default: 1000ms, time between reconnection attempts
        //   reconnectionDelayMax: 5000, // Default: 5000ms, maximum delay between reconnection attempts
        //   timeout: 20000, // Default: 20000ms, time before a connect error is emitted
        // }
      );
      socket.current.emit("add-user", userInfo.id);
      dispatch({
        type: SET_SOCKET,
        socket,
      });
    }
  }, [userInfo]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      // recieving "msg-recieve" socket with data {from, to, message}
      socket.current.on("msg-recieve", (data) => {
        const { from, to, message } = data;

        const chatUser = currentChatUserRef.current;

        dispatch({
          type: UPDATE_USER_CONTACTS_ON_RECEIVE,
          data: { from, message, to },
        });

        if (chatUser?.id === data.from) {
          // receiver and sender are at each others chat.

          dispatch({
            type: ADD_MESSAGE,
            newMessage: {
              ...data.message,
            },
          });
        } else if (chatUser?.id !== data.from || !chatUser) {
          // Optionally handle the case where the message is for a different user
          toast.info(
            <div>
              <strong>New message from {data.from}</strong>
              <p>{data.message.message}</p>
            </div>,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
          playNotificationSound(); // play notification sound.
        }
      });

      socket.current.on("is-on-same-chat", ({ status }) => {
        dispatch({
          type: IS_ON_SAME_CHAT,
          status,
        });
      });

      // message status change
      socket.current.on("msg-status-update", ({ userId, contactId }) => {
        dispatch({
          type: UPDATE_MESSAGE_STATUS,
          data: {
            userId,
            contactId,
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

      // typing or not...
      socket.current.on("typing", ({ to, from }) => {
        dispatch({ type: SET_IS_TYPING, typing: { to, from } });
      });

      socket.current.on("noTyping", ({ to, from }) => {
        dispatch({ type: SET_NOT_TYPING, noTyping: { to, from } });
      });

      // these are not working properly....
      // socket.current.on("disconnect", (reason) => {
      //   console.log("Disconnected from server bcz", reason);
      //   socket.current.connect();
      //   if (userInfo) {
      //     socket.current = io(HOST);
      //     socket.current.emit("add-user", userInfo.id);
      //     dispatch({
      //       type: SET_SOCKET,
      //       socket,
      //     });
      //   }
      // });

      // socket.current.on("reconnect", () => {
      //   console.log("Reconnected to server");
      //   if (userInfo) {
      //     socket.current = io(HOST);
      //     socket.current.emit("add-user", userInfo.id);
      //     dispatch({
      //       type: SET_SOCKET,
      //       socket,
      //     });
      //   }
      // });

      setSocketEvent(true);
    }
  }, [socket.current]);

  // disconnect when not visible tab
  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === "visible" && socket.current.disconnected) {
  //       console.log("Tab became visible. Attempting to reconnect...");
  //       socket.current.connect();
  //     }
  //   };

  //   document.addEventListener("visibilitychange", handleVisibilityChange);

  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, [socket.current]);

  // sockets for messages and calling

  return (
    <>
      {showPermissionModal && (
        <PermissionModal onAllow={handleAllowSound} onDeny={handleDenySound} />
      )}
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
                messagesSearch || profilePage === "chatuser"
                  ? "grid grid-cols-2"
                  : "grid-cols-2"
              }`}
            >
              <Chat />
              {messagesSearch && <SearchMessages />}
              {profilePage === "chatuser" && <UserProfile />}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      )}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
      <ToastMessage />
    </>
  );
}

export default Main;
