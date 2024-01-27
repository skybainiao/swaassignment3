// src/redux/reducers/scoreReducer.ts
import { Action } from './types'; // 导入 Action 类型

const scoreInitialState = {
    score: 0,
};

const scoreReducer = (state = scoreInitialState, action: Action) => {
    switch (action.type) {
        case 'INCREASE_SCORE':
            return { ...state, score: state.score + action.payload.amount };
        default:
            return state;
    }
};

export default scoreReducer;
