import { ADD_MESSAGE, CHANGE_CURRENT_CHAT_USER, SET_ALL_CONTACTS_PAGE, SET_MESSAGE_SEARCH, SET_MESSAGES, SET_NEW_USER, SET_SOCKET, SET_USER_INFO } from "./constants";

export const initialState = {
    userInfo: undefined,
    newUser: false,
    contactsPage:false,
    currentChatUser: undefined,
    messages:[],
    socket : undefined,
    messagesSearch:false, 
}

const reducer = (state, action)=>{
    switch(action.type){
        case SET_USER_INFO:
            return {
                ...state,
                userInfo: action.userInfo,
            };
        case SET_NEW_USER:
            return{
                ...state,
                newUser: action.newUser,
            };
        case SET_ALL_CONTACTS_PAGE:
            return{
                ...state,
                contactsPage:!state.contactsPage,
            };
        case CHANGE_CURRENT_CHAT_USER:
            return{
                ...state,
                currentChatUser: action.user
            };
        case SET_MESSAGES:
            return{
                ...state,
                messages:action.messages,
            }
        case SET_SOCKET:
            return{
                ...state,
                socket:action.socket,
            }
        case ADD_MESSAGE:
            return{
                ...state,
                messages:[...state.messages, action.newMessage]
            }
        case SET_MESSAGE_SEARCH:
            return{
                ...state,
                messagesSearch: !state.messagesSearch,
            }
        default:
            return state;
    }
}

export default reducer;