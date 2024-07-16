import { SET_ALL_CONTACTS_PAGE } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiArrowBack, BiSearch } from "react-icons/bi";
import ChatLIstItem from "./ChatLIstItem";

function ContactsList() {
  const [allContacts, setAllContacts] = useState([]);
  const [{}, dispatch] = useStateProvider();
  useEffect(() => {
    const getContacts = async () => {
      try {
        const {
          data: { users },
        } = await axios.get(GET_ALL_CONTACTS);
        setAllContacts(users);
      } catch (err) {
        console.log(err);
      }
    };
    getContacts();
  }, []);

  return (
    <div className="h-full flex flex-col ">
      <div className="h-24 flex items-end px-3 py-4">
        <div className="flex items-center gap-12 text-white">
          <BiArrowBack
            className=" text-panel-header-icon cursor-pointer text-xl"
            onClick={() => dispatch({ type: SET_ALL_CONTACTS_PAGE })}
          />
          <span>New chat</span>
        </div>
      </div>
      <div className=" bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar ">
        <div className="flex items-center py-3 gap-3 h-14">
          <div className=" bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4">
            <div>
              <BiSearch className=" text-panel-header-icon cursor-pointer text-l" />
            </div>
            <div>
              <input
                type="text"
                placeholder="Search contacts"
                className=" bg-transparent text-sm focus:outline-none text-white w-full"
              />
            </div>
          </div>
        </div>
        {Object.entries(allContacts).map(([initialLetter, userList]) => {
          return (
            <div key={Date.now() + initialLetter}>
              <div className=" text-teal-light pl-10 py-5">{initialLetter}</div>
              {userList.map((user, index) => {
                return (
                  <ChatLIstItem
                    key={user.id}
                    data={user}
                    isContactPage={true}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ContactsList;
