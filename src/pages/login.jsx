import React, { useEffect, useState } from "react";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import Image from "next/image";
import {FcGoogle} from 'react-icons/fc'
import axios from "axios";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import { SET_NEW_USER, SET_USER_INFO } from "@/context/constants";



const gprovider = new GoogleAuthProvider();
function login() {
  const router = useRouter();
  const [{userInfo, newUser}, dispatch] = useStateProvider();

  useEffect(()=>{
    console.log(userInfo, newUser);
    if(userInfo?.id && !newUser) router.push('/');
  }, [userInfo, newUser, router]);

  const signinWithGoogle = async () => {
    try {
      const {user} =  await signInWithPopup(firebaseAuth, gprovider);
      const { displayName: name, email, photoURL:profileImage } = user;
      if(email){
        // console.log(email);
        // add query to add data in database
        const {data} = await axios.post(CHECK_USER_ROUTE, {email});
        if(!data.status){
          dispatch({
            type: SET_NEW_USER, newUser: true,
          })
          dispatch({
            type: SET_USER_INFO,
            userInfo: {
              name,
              email,
              profileImage,
              status:"Active",
            }
          })
          router.push('/onboarding');
        }
        else{
          const {id, name, email, profilePicture: profileImage, status} = data.data; 
          dispatch({
            type: SET_USER_INFO,
            userInfo: {
              id,
              name,
              email,
              profileImage,
              status,
            }
          })
          router.push('/');
        }

      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
      <div className="bg-conversation-panel-background h-[100vh] w-full flex items-center justify-center">
        <div className="flex items-center flex-col p-2 m-2 w-fit border-white border-2 shadow-md shadow-teal-light rounded-md">
          <Image src="/logo.png" alt="logo img" width={150} height={150} />
          <div className="text-center text-teal-light">
            <div className="text-4xl font-bold">Login to Your Account</div>
            <div className="mt-3 text-c30">
              Connect and chat with anyone, anywhere
            </div>
          </div>

          <button className=" group flex justify-center items-center gap-1 text-c3 mt-5 cursor-pointer" onClick={signinWithGoogle}>
            <FcGoogle className="text-6xl" />
            <span className=" text-md font-extrabold text-xl text-teal-light group-hover:text-white duration-300 transition-all">Sign-in With Google</span>
          </button>
        </div>
      </div>
  );
}

export default login;
