import { SET_ONLINE_USERS, SET_USER_CONTACTS } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect } from "react";
import ChatLIstItem from "./ChatLIstItem";

function List() {
  const [{ userInfo, userContacts, filteredContacts }, dispatch] =
    useStateProvider();

  // get contact list...
  const getContacts = async () => {
    try {
      const {
        data: { users, onlineUsers },
      } = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo.id}`);

      dispatch({
        type: SET_ONLINE_USERS,
        onlineUsers,
      });
      dispatch({
        type: SET_USER_CONTACTS,
        userContacts: users,
      });
      // console.log(users, onlineUsers);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userInfo?.id) {
      getContacts();
    }
  }, [userInfo]);

  return (
    <div className=" bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
      {filteredContacts && filteredContacts.length > 0
        ? filteredContacts.map((contact) => (
            <ChatLIstItem data={contact} key={contact.id} />
          ))
        : userContacts.map((contact) => (
            <ChatLIstItem data={contact} key={contact.id} />
          ))}
    </div>
  );
}

export default List;
