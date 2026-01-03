import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import Input from "@/components/common/Input";
import Avatar from "@/components/common/Avatar";

import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import { useStateProvider } from "@/context/StateContext";
import { SET_NEW_USER, SET_USER_INFO } from "@/context/constants";
import Loader from "@/components/common/Loader";

import { languageList } from "lingva-scraper";
import { FaCircleUser } from "react-icons/fa6";
import { MdTextsms } from "react-icons/md";

function onboarding() {
  const router = useRouter();
  const [{ userInfo, newUser }, dispatch] = useStateProvider();
  const [name, setName] = useState(userInfo ? userInfo.name : "");
  const [about, setAbout] = useState("");
  const [lg, setLg] = useState("English");
  const [imgUrl, setImg] = useState(
    userInfo ? userInfo.profileImage : "/default_avatar.png"
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!newUser && !userInfo?.email) router.push("/login");
    else if (!newUser && userInfo?.id) router.push("/");
  }, [newUser, userInfo, router]);

  const onboardingHandler = async () => {
    if (validateDetailes()) {
      setIsLoading(true);
      const email = userInfo.email;
      try {
        const { data } = await axios.post(ONBOARD_USER_ROUTE, {
          email,
          name,
          about,
          imgUrl,
          lg
        });

        setIsLoading(false);

        if (data.status) {
          dispatch({
            type: SET_NEW_USER,
            newUser: false,
          });
          dispatch({
            type: SET_USER_INFO,
            userInfo: {
              id: data.data.id,
              name,
              email,
              profileImage: imgUrl,
              status: data.data.about,
              langauge: data.data.langauge
            },
          });
          router.push("/");
        }
      } catch (err) {
        if (process.env.NODE_ENV !== "production") console.error(err);
        setIsLoading(false);
      }
    }
  };

  const validateDetailes = () => {
    if (name.length < 3) return false;
    else return true;
  };

  return (
    <div className="bg-icon-lighter h-fit md:h-[100vh] w-full flex items-center justify-center p-2">
      {isLoading && <Loader />}
      <div className="flex items-center flex-col p-2 m-2 w-full  shadow-teal-light rounded-md">
        <Image src="/logo.png" alt="logo img" width={150} height={150} />
        <div className="text-center text-teal-light">
          <div className="mt-1 text-xs">
            Connect and chat with anyone, anywhere
          </div>
          <div className=" mt-2 text-3xl font-bold">Create Your Profile</div>
        </div>
        <div className="flex flex-col-reverse md:flex-row  w-full justify-center gap-2 items-center m-2">
          <div className="flex flex-col gap-2 mt-5 items-start justify-start p-2">
            <Input
              name="Profile Name"
              state={name}
              type="text"
              Icon={FaCircleUser}
              placeholder="Enter your name"
              setState={(e) => setName(e.target.value)}
              label
            />
            <Input
              name="About"
              state={about}
              type="text"
              placeholder="Chit Chat"
              Icon={MdTextsms}
              setState={(e) => setAbout(e.target.value)}
              label
            />

            <div className="flex flex-col justify-center p-2">
              <label htmlFor="lg" className="text-xs font-semibold px-1">
                Select langauge
              </label>

              <select
                name="lg"
                id="lg"
                value={lg}
                onChange={(e)=>setLg(e.target.value)}
                className="text-white bg-gray-800 w-full pl-8 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-800 scrollbar"
              >
                {Object.entries(languageList.all).map((lg) => (
                  <option key={lg} value={lg[1]}>{lg[1]}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-center w-full">
              <button
                className="text-white font-bold py-2 px-4 w-full rounded bg-teal-light hover:bg-indigo-900 focus:bg-indigo-700"
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
