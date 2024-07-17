import { CHANGE_CURRENT_CHAT_USER, SET_ALL_CONTACTS_PAGE, SET_MESSAGES, SET_NEW_USER, SET_USER_INFO } from "./constants";

export const initialState = {
    userInfo: undefined,
    newUser: false,
    contactsPage:false,
    currentChatUser: undefined,
    messages:[],
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
        default:
            return state;
    }
}

export default reducer;