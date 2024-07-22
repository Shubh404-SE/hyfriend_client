import { SET_USER_INFO } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function logout() {
  const [{ socket, userInfo }, dispatch] = useStateProvider();
  const router = useRouter();
  useEffect(() => {
    socket.current.emit("signout", userInfo.id);
    dispatch({ type: SET_USER_INFO, userInfo: undefined });
    signOut(firebaseAuth);
    router.push("/login");
  }, [socket]);
  return <div></div>;
}

export default logout;
