import { SET_MESSAGE_SEARCH } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

function SearchMessages() {
  const [{ currentChatUser, messages }, dispatch] = useStateProvider();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedMessages, setSearchedMessages] = useState([]);

  useEffect(()=>{
    if(searchTerm){
      setSearchedMessages(messages.filter(message => message.type ==="text" && message.message.includes(searchTerm)))
    }
    else{
      setSearchedMessages([]);
    }
  }, [searchTerm]);


  return (
    <div className="border-conversation-border border-1 w-full flex flex-col z-10 max-h-screen gap-2 bg-gray-900">
      <div className="h-16 px-4 py-5 flex gap-10 items-center bg-panel-header-background text-primary-strong">
        <IoClose
          className="text-xl cursor-pointer text-icon-lighter"
          onClick={() => dispatch({ type: SET_MESSAGE_SEARCH })}
        />
        <span>Search Messages</span>
      </div>
      <div className="overflow-auto custom-scrollbar h-full">
        <div className="flex flex-col items-center w-full">
          <div className="flx items-center px-5 gap-3 h-14 w-full">
            <div className=" bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
              <div>
                <BiSearch className=" text-panel-header-icon cursor-pointer text-l" />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Search messages"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className=" bg-transparent text-sm focus:outline-none text-white w-full"
                />
              </div>
            </div>
          </div>
          <span className="mt-10 text-secondary">
            {!searchTerm.length &&
              `Search for message with ${currentChatUser.name}`}
          </span>
        </div>
        <div className="flex flex-col justify-center h-full">
          {searchTerm.length > 0 && !searchedMessages.length && (
            <span className="text-secondary w-full flex justify-center">
              No messages found
            </span>
          )}
          <div className="flex flex-col w-full h-full">
            {
              searchedMessages.map((message)=>{
                return(
                  <div key={message.id} className=" flex cursor-pointer flex-col justify-center hover:bg-background-default-hover w-full px-5 border-b-[0.5px] border-secondary py-5">
                    <div className="text-sm text-secondary">
                      {calculateTime(message.createdAt)}
                    </div>
                    <div className="text-icon-blue">
                      {message.message}
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchMessages;
