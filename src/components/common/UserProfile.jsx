import { useStateProvider } from "@/context/StateContext";
import React, { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import { BiArrowBack, BiMessageRoundedDots } from "react-icons/bi";
import { FaCircleUser, FaUserLarge } from "react-icons/fa6";
import { SET_PROFILE_PAGE, SET_USER_INFO } from "@/context/constants";
import { MdOutlineEmail } from "react-icons/md";
import Loader from "./Loader";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";

const UserProfile = () => {
  const [{ userInfo, currentChatUser, profilePage, onlineUsers }, dispatch] =
    useStateProvider();
  const [name, setName] = useState(
    profilePage === "user" ? userInfo.name : currentChatUser.name
  );
  const [email, setEmail] = useState(
    profilePage === "user" ? userInfo.email : currentChatUser.email
  );
  const [about, setAbout] = useState(
    profilePage === "user" ? userInfo.status : currentChatUser.about
  );
  const [imgUrl, setImg] = useState(
    profilePage === "user"
      ? userInfo.profileImage
      : currentChatUser.profilePicture
  );

  const [prevData, setPrevData] = useState({
    name: profilePage === "user" ? userInfo.name : currentChatUser.name,
    about: profilePage === "user" ? userInfo.status : currentChatUser.about,
    imgUrl:
      profilePage === "user"
        ? userInfo.profileImage
        : currentChatUser.profilePicture,
  });

  const [isEditProfile, setIsEditProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use a ref to track the initial render
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      setIsEditProfile(true);
    } else {
      isMounted.current = true;
    }
  }, [imgUrl]);

  const editProfileHandler = async () => {
    if (validateDetailes()) {
      setIsLoading(true);
      try {
        const { data } = await axios.post(ONBOARD_USER_ROUTE, {
          email,
          name,
          about,
          imgUrl,
        });

        console.log(data.data.about);
        setIsLoading(false);

        if (data.status) {
          dispatch({
            type: SET_USER_INFO,
            userInfo: {
              id: data.data.id,
              name,
              email,
              profileImage: imgUrl,
              status: data.data.about,
            },
          });
          setIsEditProfile(false);
        }
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setIsEditProfile(false);
      }
    }
  };

  const validateDetailes = () => {
    if (name.length < 3) return false;
    else return true;
  };

  const backHandle = () => {
    setIsEditProfile(false);
    dispatch({ type: SET_PROFILE_PAGE, pageType: undefined });
  };

  return (
    <div className="w-full z-50 bg-panel-header-background">
      {isLoading && <Loader />}
      <div className="h-[64px] px-4 py-3 w-full">
        <div className="flex items-center gap-1 text-white ">
          <BiArrowBack
            className=" text-panel-header-icon cursor-pointer text-xl"
            onClick={backHandle}
          />
          <span className="mx-auto text-2xl">Profile</span>
        </div>
      </div>
      <div className="flex flex-col-reverse justify-end h-full w-full py-3 px-2 gap-1 overflow-auto custom-scrollbar bg-search-input-container-background">
        <div className="flex flex-col gap-2 justify-start p-2">
          <div className="flex gap-1 items-center just -mx-3">
            <MdOutlineEmail className="text-3xl text-white" />
            <div className=" flex flex-col gap-2 px-3 mb-5">
              <label
                htmlFor="email"
                className="text-sm font-semibold px-1 text-white"
              >
                Email Address
              </label>
              <input
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-4 pr-3 py-2 rounded-lg"
                placeholder="John Smith"
                disabled
              />
            </div>
          </div>

          <div className="flex gap-1 items-center -mx-3">
            <FaCircleUser className="text-3xl text-white" />
            <div className=" flex flex-col gap-2 px-3 mb-5">
              <label
                htmlFor="name"
                className="text-sm font-semibold px-1 text-white"
              >
                Profile Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full pl-4 pr-3 py-2 rounded-lg ${
                  !isEditProfile
                    ? ""
                    : "border-2 border-gray-200 outline-none focus:border-indigo-800"
                } `}
                placeholder="John Smith"
                disabled={profilePage === "chatuser" ? true : !isEditProfile}
              />
            </div>
          </div>

          <div className="flex gap-1 items-center -mx-3">
            <BiMessageRoundedDots className="text-3xl text-white" />
            <div className=" flex flex-col gap-2 px-3 mb-5">
              <label
                htmlFor="about"
                className="text-sm font-semibold px-1 text-white"
              >
                About
              </label>
              <input
                type="text"
                name="about"
                value={about ? about : ""}
                onChange={(e) => setAbout(e.target.value)}
                className={`w-full pl-4 pr-3 py-2 rounded-lg ${
                  !isEditProfile
                    ? ""
                    : "border-2 border-gray-200 outline-none focus:border-indigo-800"
                } `}
                placeholder="Avilable..."
                disabled={profilePage === "chatuser" ? true : !isEditProfile}
              />
            </div>
          </div>

          {profilePage === "user" && (
            <div className="flex items-center justify-center w-full">
              {!isEditProfile ? (
                <button
                  className="block w-full max-w-xs mx-auto bg-teal-light hover:bg-indigo-900 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
                  onClick={() => setIsEditProfile(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2 w-full">
                  <button
                    className="block w-full max-w-xs mx-auto bg-teal-light hover:bg-indigo-900 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
                    onClick={editProfileHandler}
                  >
                    Save
                  </button>
                  <button
                    className="block w-full max-w-xs mx-auto bg-teal-light hover:bg-indigo-900 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
                    onClick={() => {
                      setIsEditProfile(false);
                      setAbout(prevData.about);
                      setImg(prevData.imgUrl);
                      setName(prevData.name);
                    }}
                  >
                    Discard
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-2">
          <Avatar
            type={`${profilePage === "user" ? "xl" : "xll"}`}
            image={imgUrl}
            setImage={setImg}
          />
          {profilePage === "chatuser" && (
            <span className="text-xl text-white">
              {onlineUsers.includes(currentChatUser.id) ? "Online" : "Offline"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
