import {createAction} from 'redux-actions';
import * as ActionTypes from '../constants/ActionTypes';

let action_salePayment_change=createAction(ActionTypes.SALEPAYMENT_CHANGE);
let action_salePay_change=createAction(ActionTypes.SALEPAY_CHANGE);

export function salePaymentChange(payment){
    return dispatch =>{
        dispatch(action_salePayment_change(payment));
    }
}

export function salePayChange(payment){
    return dispatch =>{
        dispatch(action_salePay_change(payment));
    }
}