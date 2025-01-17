import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import { SET_ALL_CONTACTS_PAGE, SET_PROFILE_PAGE, SET_USER_INFO } from "@/context/constants";
import ContextMenu from "../common/ContextMenu";
import { useRouter } from "next/router";
import { FaRegUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

function ChatListHeader() {
  const [{ userInfo, socket }, dispatch] = useStateProvider();
  const router = useRouter();
  const [isContextMenue, setIsContextMenue] = useState(false);
  const [contextMenueCordinates, setContextMenueCordinates] = useState({
    x: 0,
    y: 0,
  });

  const showContextMenue = (e) => {
    e.preventDefault();
    setIsContextMenue(true);
  };

  const contextMenuOptions = [
    {
      Icon: <FaRegUserCircle />,
      name:"Profile",
      callback: ()=>{
        setIsContextMenue(false);
        dispatch({type:SET_PROFILE_PAGE, pageType:"user"});
      }
    },
    {
      Icon: <MdLogout />,
      name: "Logout",
      callback: async () => {
        setIsContextMenue(false);
        // in logout
        router.push("/logout");
      },
    },
  ];

  const handleAllContactsPage = ()=>{
    dispatch({type:SET_ALL_CONTACTS_PAGE});
  };

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center">
      <div className=" cursor-pointer">
        <Avatar type="sm" image={userInfo?.profileImage} />
      </div>
      <div className="flex gap-6">
        <BsFillChatLeftTextFill
          className=" text-panel-header-icon cursor-pointer text-xl"
          title="New Chat"
          onClick={handleAllContactsPage}
        />
        <div className="relative">
          <BsThreeDotsVertical
            className=" text-panel-header-icon cursor-pointer text-xl"
            title="Menu"
            onClick={(e)=>showContextMenue(e)}
            id="context_opener"
          />
          {isContextMenue && (
          <ContextMenu
            options={contextMenuOptions}
            contextMenu={isContextMenue}
            setContextMenu={setIsContextMenue}
          />
        )}
        </div>
      </div>
    </div>
  );
}

export default ChatListHeader;
