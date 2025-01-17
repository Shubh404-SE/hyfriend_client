import React, { useEffect, useState } from "react";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // signInWithPopup,
} from "firebase/auth";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { CHECK_USER_ROUTE, SIGNUP_USER_ROUTE } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import { SET_NEW_USER, SET_USER_INFO } from "@/context/constants";
import { toast } from "react-toastify";
import Loader from "@/components/common/Loader";
import ToastMessage from "@/components/common/ToastMessage";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaCircleUser } from "react-icons/fa6";
import Input from "@/components/common/Input";

function login() {
  const router = useRouter();
  const [{ userInfo, newUser }, dispatch] = useStateProvider();

  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    // console.log(userInfo, newUser);
    if (userInfo?.id && !newUser) router.push("/");
  }, [userInfo, newUser, router]);

  // control when user come to login even if his user already login and he did not logout yet

  // create new user
  const signupUser = async () => {
    setIsLoading(true);
    await createUserWithEmailAndPassword(
      firebaseAuth,
      data.email,
      data.password
    )
      .then(async (userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
        // store user in database
        try {
          const { data: signupUser } = await axios.post(SIGNUP_USER_ROUTE, {
            email: data.email,
            name: data.name,
          });
          console.log(signupUser);

          // remove loading
          setIsLoading(false);

          if (signupUser.status) {
            // set it as new user
            dispatch({
              type: SET_NEW_USER,
              newUser: true,
            });
            console.log("user register in database");
            setIsSignup(false);
          }
        } catch (err) {
          console.log(err);
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        setIsLoading(false);
      });
  };

  // login user
  const signin = async () => {
    setIsLoading(true);
    toast.promise(
      async () => {
        await signInWithEmailAndPassword(
          firebaseAuth,
          data.email,
          data.password
        ).then(async (userCredential) => {
          // Signed in
          const user = userCredential.user;
          // console.log(user);
          const { data: loginUser } = await axios.post(CHECK_USER_ROUTE, {
            email: data.email,
          });

          const { name, email, profilePicture } = loginUser.data;
          setIsLoading(false);
          if (!loginUser.status) {
            if (loginUser.data.onboard === false) {
              // user exist but havn't done onboard
              console.log(loginUser);
              dispatch({
                type: SET_USER_INFO,
                userInfo: {
                  name,
                  email,
                  profileImage: profilePicture,
                  status: "Active",
                },
              });
              router.push("/onboarding");
            } else {
              // user not exist
              setIsSignup(true);
            }
          } else {
            const {
              id,
              name,
              email,
              profilePicture: profileImage,
              status,
            } = loginUser.data;
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
            router.push("/");
          }
        });
      },
      {
        pending: "Loading",
        success: "Login Successful",
        error: "You may have entered the wrong email id",
      },
      {
        autoClose: 5000,
      }
    );
  };

  return (
    <div className="bg-conversation-panel-background h-[100vh] w-full flex items-center justify-center">
      {isLoading && <Loader />}
      <div
        className="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden m-2"
        style={{ maxWidth: "1000px" }}
      >
        <ToastMessage />
        <div className="md:flex w-full">
          <div className="hidden md:block w-1/2 border-r-2 border-black bg-slate-800 py-10 px-10">
            <Image src="/logo.png" alt="logo img" width={400} height={400} />
            <div className="text-center text-teal-light">
              <div className="mt-3 text-white">
                Connect and chat with anyone, anywhere
              </div>
            </div>
          </div>
          {!isSignup ? (
            <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
              <h2 className="text-3xl font-semibold text-teal-light text-center select-none">
                HyFriend
              </h2>
              <p className="text-xl text-gray-600 text-center">Welcome back!</p>
              <button className="flex items-center justify-between w-full mt-4 text-white rounded-lg shadow-md hover:bg-gray-200">
                <div className="px-4 py-3">
                  <FcGoogle className=" text-xl" />
                </div>
                <h1 className="px-4 py-3 w-5/6 text-center text-gray-600 font-bold">
                  Sign in with Google
                </h1>
              </button>
              <div className="mt-4 text-xs text-center text-gray-500 uppercase">
                or login with email
              </div>
              <Input
                name="Email"
                state={data?.email}
                type="email"
                placeholder="johnsmith@example.com"
                Icon={MdOutlineEmail}
                setState={(e) =>
                  setData((prev) => setData({ ...prev, email: e.target.value }))
                }
                label
              />
              <Input
                name="Password"
                state={data?.password}
                type="password"
                placeholder="************"
                Icon={RiLockPasswordLine}
                setState={(e) =>
                  setData((prev) =>
                    setData({ ...prev, password: e.target.value })
                  )
                }
                label
              />
              <div className="mt-8">
                <button
                  onClick={signin}
                  className=" text-white font-bold py-2 px-4 w-full rounded bg-teal-light hover:bg-indigo-900 focus:bg-indigo-700"
                >
                  Login
                </button>
              </div>
              <div className="mt-4 flex items-center justify-center">
                <button
                  className="text-xs text-gray-500 underline hover:text-blue-500"
                  onClick={() => setIsSignup(true)}
                >
                  Create new Account, Click here!!
                </button>
              </div>
            </div>
          ) : (
            // sign up page
            <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-semibold text-teal-light text-center select-none">
                  HyFriend
                </h1>
                <p>Enter your information to register</p>
              </div>
              <div>
                <Input
                  name="Name"
                  state={data?.name}
                  type="text"
                  placeholder="John Smith"
                  Icon={FaCircleUser}
                  setState={(e) => setData((prev) => setData({ ...prev, name: e.target.value }))}
                  label
                />
                <Input
                  name="Email"
                  state={data?.email}
                  type="email"
                  placeholder="johnsmith@example.com"
                  Icon={MdOutlineEmail}
                  setState={(e) =>
                    setData((prev) =>
                      setData({ ...prev, email: e.target.value })
                    )
                  }
                  label
                />
                <Input
                  name="Password"
                  state={data?.password}
                  type="password"
                  placeholder="************"
                  Icon={RiLockPasswordLine}
                  setState={(e) =>
                    setData((prev) =>
                      setData({ ...prev, password: e.target.value })
                    )
                  }
                  label
                />
                <div className="flex -mx-3">
                  <div className="w-full px-3 mb-5">
                    <button
                      onClick={signupUser}
                      className="block w-full max-w-xs mx-auto bg-teal-light hover:bg-indigo-900 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
                    >
                      REGISTER NOW
                    </button>
                  </div>
                </div>
                <button
                  className="text-xs text-gray-500 underline hover:text-blue-500 w-full text-center"
                  onClick={() => setIsSignup(false)}
                >
                  Already have account??
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default login;
