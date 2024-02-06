import { SET_NEW_USER, SET_USER_INFO } from "./constants";

export const initialState = {
    userInfo: undefined,
    newUser: false,
}

const reducer = (state, action)=>{
    switch(action.type){
        case SET_USER_INFO:
            return {
                ...state,
                userInfo: action.userInfo,
            }
        case SET_NEW_USER:
            return{
                ...state,
                newUser: action.newUser,
            }
        default:
            return state;
    }
}

export default reducer;