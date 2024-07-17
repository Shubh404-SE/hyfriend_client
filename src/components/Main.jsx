import React, { useEffect, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import { SET_MESSAGES, SET_USER_INFO } from "@/context/constants";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client";

function Main() {
  const router = useRouter();
  const [{ userInfo, currentChatUser }, dispatch] = useStateProvider();
  const socket = useRef();
  const [redirectLogin, setRedirectLogin] = useState(false);

  // check login user in realtime.
  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    if (!currentUser) router.push("/login");
    if (!userInfo && currentUser?.email) {
      const { data } = await axios.post(CHECK_USER_ROUTE, {
        email: currentUser.email,
      });
      if (!data.status) {
        router.push("/login");
      }

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
  useEffect(()=>{
    if(userInfo){
      socket.current = io(HOST);
      socket.current.emit("add-user", userInfo.id) ;
    }
  }, [userInfo]);

  // getting messages of selected user
  useEffect(()=>{
    const getMessages = async()=>{
      // console.log(userInfo.id, currentChatUser.id);
      const {data:{messages}} = await axios.get(`${GET_MESSAGES_ROUTE}/${userInfo.id}/${currentChatUser.id}`);

      dispatch({
        type:SET_MESSAGES,
        messages,
      })
    }
    if(currentChatUser?.id){
      getMessages();
    }
  }, [currentChatUser]);

  return (
    <>
      <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
        <ChatList />
        {currentChatUser ? <Chat /> : <Empty />}
      </div>
    </>
  );
}

export default Main;
