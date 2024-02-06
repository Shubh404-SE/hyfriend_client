import { useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import React, { useState } from "react";
import Input from "@/components/common/Input";

function onboarding() {
  const [{ userInfo }] = useStateProvider();

  const [name, setName] = useState(userInfo.name || "");
  const [email, setEmail] = useState(userInfo.email || "");
  const [imgUrl, setImg] = useState(
    userInfo.profilePhoto || "/default_avatar.png"
  );

  return (
    <div className="bg-conversation-panel-background h-[100vh] w-full flex items-center justify-center">
      <div className="flex items-center flex-col p-2 m-2 w-fit border-white border-2 shadow-md shadow-teal-light rounded-md">
        <Image src="/logo.png" alt="logo img" width={150} height={150} />
        <div className="text-center text-teal-light">
          <div className="mt-1 text-xs">Connect and chat with anyone, anywhere</div>
          <div className=" mt-5 text-4xl font-bold">Create Your Profile</div>
        </div>
        <div className="flex flex-col gap-2 mt-5 items-center justify-center text-white">
          <Input
            name="Profile Name"
            state={name}
            setState={setName}
            label={true}
          />
          <Input
            name="Profile Email"
            state={email}
            setState={setEmail}
            label={true}
          />
        </div>
      </div>
    </div>
  );
}

export default onboarding;
