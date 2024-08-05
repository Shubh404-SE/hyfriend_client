import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import Input from "@/components/common/Input";
import Avatar from "@/components/common/Avatar";

import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import { useStateProvider } from "@/context/StateContext";

import { SET_NEW_USER, SET_USER_INFO } from "@/context/constants";

function onboarding() {
  const router = useRouter();
  const [{ userInfo, newUser }, dispatch] = useStateProvider();
  const [name, setName] = useState(userInfo ? userInfo.name : "");
  const [about, setAbout] = useState("");
  const [imgUrl, setImg] = useState(
    userInfo ? userInfo.profileImage : "/default_avatar.png"
  );


  useEffect(()=>{
    if(!newUser && !userInfo?.email) router.push('/login');
    else if(!newUser && userInfo?.id) router.push('/');
  }, [newUser, userInfo, router]);

  const onboardingHandler = async()=>{
    if(validateDetailes()){
      const email = userInfo.email;
      try{
        const {data} = await axios.post(ONBOARD_USER_ROUTE, {
          email,
          name,
          about,
          imgUrl
        });

        if(data.status){
          dispatch({
            type: SET_NEW_USER, newUser: false,
          })
          dispatch({
            type: SET_USER_INFO,
            userInfo: {
              id:data.data.id,   
              name,
              email,
              profileImage:imgUrl,
              status:about,
            }
          })
          router.push('/');
        }
      }catch(err){
        console.log(err);
      }
    }
  }

  const validateDetailes = ()=>{
    if(name.length<3) return false;
    else return true;
  }

  return (
    <div className="bg-conversation-panel-background h-fit md:h-[100vh] w-full flex items-center justify-center p-2">
      <div className="flex items-center flex-col p-2 m-2 w-full  shadow-teal-light rounded-md">
        <Image src="/logo.png" alt="logo img" width={150} height={150} />
        <div className="text-center text-teal-light">
          <div className="mt-1 text-xs">
            Connect and chat with anyone, anywhere
          </div>
          <div className=" mt-2 text-3xl font-bold">Create Your Profile</div>
        </div>
        <div className="flex flex-col-reverse md:flex-row  w-full justify-center gap-2 items-center m-2">
          <div className="flex flex-col gap-2 mt-5 items-start justify-start text-white p-2">
            <Input
              name="Profile Name"
              state={name}
              setState={setName}
              label={true}
            />
            <Input
              name="About"
              state={about}
              setState={setAbout}
              label={true}
            />

            <div className="flex items-center justify-center w-full">
              <button
                className="FLEX items-center justify-center gap-7 bg-search-input-container-background py-2 px-4 rounded-lg"
                onClick={onboardingHandler}
              >
                Create Profile
              </button>
            </div>
          </div>
          <div>
            <Avatar type="xl" image={imgUrl} setImage={setImg} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default onboarding;
