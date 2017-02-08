import {handleActions} from 'redux-actions';

const salePaymentReducer=handleActions({
    SALEPAYMENT_CHANGE:(state,action)=>{
        const payment=action.payload;
        if(payment===undefined)
            return [];

        return payment;
    },
    SALEPAY_CHANGE:(state,action)=>{
        return action.payload;
    }
},{});

export default salePaymentReducer;