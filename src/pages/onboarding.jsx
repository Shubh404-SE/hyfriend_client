import { useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import React, { useState } from "react";
import Input from "@/components/common/Input";
import Avatar from "@/components/common/Avatar";

function onboarding() {
  const [{ userInfo }] = useStateProvider();

  const [name, setName] = useState(userInfo ? userInfo.name : "");
  const [about, setAbout] = useState("");
  const [imgUrl, setImg] = useState(
    userInfo ? userInfo.profileImage : "/default_avatar.png"
  );

  return (
    <div className="bg-conversation-panel-background h-fit md:h-[100vh] w-full flex items-center justify-center p-2">
      <div className="flex items-center flex-col p-2 m-2 w-full  shadow-teal-light rounded-md">
        <Image src="/logo.png" alt="logo img" width={150} height={150} />
        <div className="text-center text-teal-light">
          <div className="mt-1 text-xs">Connect and chat with anyone, anywhere</div>
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
