import {handleActions} from 'redux-actions';

const saleReducer = handleActions({
    PRD_SEARCH:(state,action)=> {
        console.log(JSON.stringify(state));
        console.log(JSON.stringify(action));
        return state;
    }
},{});

export default saleReducer;