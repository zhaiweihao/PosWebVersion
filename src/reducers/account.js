import {handleActions } from 'redux-actions';

const accountReducer=handleActions({
    LOGIN_REQUEST:(state,action)=>{
        return {status:action.type};
    },
    LOGIN_SUCCESS:(state,action)=>{
        return {
            status:action.type,
            data:action.payload
        };
    },
    LOGIN_FAILURE:(state,action)=>{
        return {
            status:action.type,
            data:action.payload
        };
    }
},{});

export default accountReducer;