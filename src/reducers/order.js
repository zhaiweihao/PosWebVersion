import {handleActions } from 'redux-actions';

const orderReducer=handleActions({
    ORDER_SAVE_REQUEST:(state,action)=>{
        return {
            status:action.type
        };
    },
    ORDER_SAVE_SUCCESS:(state,action)=>{
        return {
            status:action.type
        };
    },
    ORDER_SAVE_ERROR:(state,action)=>{
        return {
            status:action.type
        };
    }
},{});

export default orderReducer;