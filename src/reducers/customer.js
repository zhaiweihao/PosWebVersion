import {handleActions } from 'redux-actions';

const customerReducer=handleActions({
    CUSTOMER_REQUEST:(state,action)=>{
        return {
            status:action.type
        }
    },
    CUSTOMER_CHANGE:(state,action)=>{
        return {
            status:action.type,
            data:action.payload
        };
    },
    CUSTOMER_ERROR:(state,action)=>{
        return {
            status:action.type
        }
    },
    CUSTOMER_INIT:(state,action)=>{
        console.log('customer reducer init ')
        return {
            status:action.type
        }
    }
},{});

export default customerReducer;