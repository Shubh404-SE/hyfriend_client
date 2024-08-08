import {
  ADD_MESSAGE,
  CHANGE_CURRENT_CHAT_USER,
  END_CALL,
  SET_ALL_CONTACTS_PAGE,
  SET_CONTACT_SEARCH,
  SET_EXIT_CHAT,
  SET_INCOMING_VIDEO_CALL,
  SET_INCOMING_VOICE_CALL,
  SET_IS_TYPING,
  SET_MESSAGE_SEARCH,
  SET_MESSAGES,
  SET_NEW_USER,
  SET_NOT_TYPING,
  SET_ONLINE_USERS,
  SET_PROFILE_PAGE,
  SET_SOCKET,
  SET_USER_CONTACTS,
  SET_USER_INFO,
  SET_VIDEO_CALL,
  SET_VOICE_CALL,
} from "./constants";

export const initialState = {
  userInfo: undefined,
  newUser: false,
  contactsPage: false,
  profilePage:undefined,
  currentChatUser: undefined,
  messages: [],
  socket: undefined,
  messagesSearch: false,
  userContacts: [],
  onlineUsers: [],
  isTyping: {},
  filteredContacts: [],
  videoCall: undefined,
  voiceCall: undefined,
  incomingVoiceCall: undefined,
  incomingVideoCall: undefined,
};

const reducer = (state, action) => {
  switch (action.type) {
    case SET_USER_INFO:
      return {
        ...state,
        userInfo: action.userInfo,
      };
    case SET_NEW_USER:
      return {
        ...state,
        newUser: action.newUser,
      };
    case SET_ALL_CONTACTS_PAGE:
      return {
        ...state,
        contactsPage: !state.contactsPage,
      };
    case SET_PROFILE_PAGE:
      return{
        ...state,
        profilePage: action.pageType,
      }
    case CHANGE_CURRENT_CHAT_USER:
      return {
        ...state,
        currentChatUser: action.user,
      };
    case SET_MESSAGES:
      return {
        ...state,
        messages: action.messages,
      };
    case SET_SOCKET:
      return {
        ...state,
        socket: action.socket,
      };
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.newMessage],
      };
    case SET_MESSAGE_SEARCH:
      return {
        ...state,
        messagesSearch: !state.messagesSearch,
      };
    case SET_USER_CONTACTS:
      return {
        ...state,
        userContacts: action.userContacts,
      };
    case SET_ONLINE_USERS:
      return {
        ...state,
        onlineUsers: action.onlineUsers,
      };
    case SET_CONTACT_SEARCH: {
      const filteredContacts = state.userContacts.filter((contact) =>
        contact.name.toLowerCase().includes(action.contactSearch.toLowerCase())
      );
      return {
        ...state,
        filteredContacts,
        contactSearch: action.contactSearch,
      };
    }
    case SET_IS_TYPING:
      return {
        ...state,
        isTyping: {...state.isTyping,  [action.typing.from]: true},
      };
    case SET_NOT_TYPING:
      const updatedIsTyping = { ...state.isTyping };
      delete updatedIsTyping[action.noTyping.from];
      return {
        ...state,
        isTyping: updatedIsTyping,
      };
    case SET_VIDEO_CALL:
      return {
        ...state,
        videoCall: action.videoCall,
      };
    case SET_VOICE_CALL:
      return {
        ...state,
        voiceCall: action.voiceCall,
      };
    case SET_INCOMING_VOICE_CALL:
      return {
        ...state,
        incomingVoiceCall: action.incomingVoiceCall,
      };
    case SET_INCOMING_VIDEO_CALL:
      return {
        ...state,
        incomingVideoCall: action.incomingVideoCall,
      };
    case END_CALL:
      return {
        ...state,
        voiceCall: undefined,
        videoCall: undefined,
        incomingVideoCall: undefined,
        incomingVoiceCall: undefined,
      };
    case SET_EXIT_CHAT:
      return {
        ...state,
        currentChatUser: undefined,
      };
    default:
      return state;
  }
};

export default reducer;
