import React, { useEffect, useState } from "react";
import ChatListHeader from "./ChatListHeader";
import SearchBar from "./SearchBar";
import List from "./List";
import { useStateProvider } from "@/context/StateContext";
import ContactsList from "./ContactsList";
import UserProfile from "../common/UserProfile";

function ChatList() {
  const [{ contactsPage, profilePage }] = useStateProvider();
  const [pageType, setPageType] = useState("default");

  useEffect(() => {
    if (contactsPage) {
      setPageType("all-contacts");
    } else {
      setPageType("default");
    }
  }, [contactsPage]);

  return (
    <div className=" bg-panel-header-background/95 flex flex-col max-h-screen z-20">
      {pageType === "default" && !profilePage && (
        <>
          <ChatListHeader />
          <SearchBar />
          <List />
        </>
      )}
      {pageType === "all-contacts" && <ContactsList />}
      {profilePage === "user" && <UserProfile />}
    </div>
  );
}

export default ChatList;
