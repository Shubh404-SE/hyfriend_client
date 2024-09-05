import { SET_ALL_CONTACTS_PAGE } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import axios, { all } from "axios";
import React, { useEffect, useState } from "react";
import { BiArrowBack, BiSearch } from "react-icons/bi";
import ChatLIstItem from "./ChatLIstItem";
import { MdGroupAdd } from "react-icons/md";
import Avatar from "../common/Avatar";
import { ImCross } from "react-icons/im";

function NewGroup({ allContacts, onBack }) {
  const [{}, dispatch] = useStateProvider();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchContacts, setSearchContacts] = useState(allContacts);
  const [selectedUsers, setSelectedUsers] = useState([]); // Added state for selected users

  useEffect(() => {
    if (searchTerm.length) {
      const filteredData = {};
      Object.keys(allContacts).forEach((key) => {
        filteredData[key] = allContacts[key].filter((obj) =>
          obj.name.toLowerCase().includes(searchTerm.toLocaleLowerCase())
        );
      });
      setSearchContacts(filteredData);
    } else {
      setSearchContacts(allContacts);
    }
  }, [searchTerm]);

  const handleContactSelect = (user) => {
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleCancelSelect = (user) => {
    setSelectedUsers(selectedUsers.filter((selected) => selected !== user));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="h-24 flex items-end justify-between gap-2 px-3 py-4">
        <div className="flex items-center gap-12 text-white">
          <BiArrowBack
            className=" text-panel-header-icon cursor-pointer text-xl"
            onClick={() => onBack(false)}
          />
          <span>New group</span>
        </div>
        {selectedUsers.length ? (
          <button className={`bg-teal-light py-1 px-3 rounded-lg text-white`}>
            Next
          </button>
        ) : (
          <></>
        )}
      </div>
      <div className=" bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar ">
        <div className="flex flex-col justify-center py-3 gap-3 h-fit">
          <div className=" bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4">
            <div>
              <BiSearch className=" text-panel-header-icon cursor-pointer text-lg" />
            </div>
            <div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search contacts"
                className=" bg-transparent text-sm focus:outline-none text-white w-full"
              />
            </div>
          </div>
          <div className="flex flex-wrap overflow-auto custom-scrollbar items-center gap-2 px-2">
            {/* selected user */}
            {selectedUsers.map((user, index) => {
              return (
                <div
                  key={user.email}
                  className="flex items-center gap-[4px] px-2 py-1 bg-icon-lighter rounded-full"
                >
                  <Avatar type="xs" image={user.profilePicture} />
                  <span>{user.name}</span>
                  <div 
                  onClick={()=>handleCancelSelect(user)}
                  className="hover:text-red-500 select-none cursor-pointer text-xs hover:scale-110 duration-150 transition-all">
                    <ImCross />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {Object.entries(searchContacts).map(([initialLetter, userList]) => {
          return (
            <div key={Date.now() + initialLetter}>
              {userList.length && (
                <div className=" text-teal-light pl-10 py-5">
                  {initialLetter}
                </div>
              )}
              {userList.map((user, index) => {
                return (
                  <div
                    key={user.id}
                    className="w-full flex items-center pr-3 gap-2 hover:bg-background-default-hover cursor-pointer"
                  >
                    <label
                      htmlFor={user.email}
                      className="w-full flex items-center justify-between gap-2 text-white"
                    >
                      <div className={`flex cursor-pointer items-center`}>
                        <div className="min-w-fit px-5 pt-3 pb-1 relative">
                          <Avatar type="lg" image={user?.profilePicture} />
                        </div>
                        <div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full">
                          <div className="flex flex-col justify-between">
                            <span className="">{user?.name}</span>
                            <span className="text-xs">
                              {user?.about || "\u00A0"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </label>

                    <input
                      type="checkbox"
                      id={user.email}
                      className="ml-auto w-4 h-4 border-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                      checked={selectedUsers.includes(user)}
                      onChange={() =>
                        selectedUsers.includes(user)
                          ? handleCancelSelect(user)
                          : handleContactSelect(user)
                      }
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NewGroup;
