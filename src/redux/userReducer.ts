// src/redux/reducers/userReducer.ts
import { Action } from './types'; // 导入 Action 类型

const initialState = {
    username: null,
    isAuthenticated: false,
};

const userReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, username: action.payload.username, isAuthenticated: true };
        case 'LOGOUT':
            return { ...state, username: null, isAuthenticated: false };
        default:
            return state;
    }
};

export default userReducer;
