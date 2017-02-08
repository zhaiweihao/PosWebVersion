import {handleActions} from 'redux-actions';

const couponReducer=handleActions({
    COUPON_REQUEST:(state,action)=>{
        return {
            status:action.type//,
            //couponNo:state.couponNo
        };
    },
    COUPON_SUCCESS:(state,action)=>{
        return {
            status:action.type,
            content:action.payload
        };
    },
    COUPON_FAILURE:(state,action)=>{
        return {
            status:action.type//,
            //couponNo:state.couponNo
        }
    },
    COUPON_INIT:(state,action)=>{
        return {
            status:action.type
        }
    }
},{});

export default couponReducer;