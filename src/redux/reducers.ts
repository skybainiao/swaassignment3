// src/redux/reducers.ts
import { combineReducers } from 'redux';
import userReducer from './userReducer';
import scoreReducer from './scoreReducer';

const rootReducer = combineReducers({
    user: userReducer,
    score: scoreReducer,
    // 其他reducers可以在这里添加
});

export default rootReducer;
