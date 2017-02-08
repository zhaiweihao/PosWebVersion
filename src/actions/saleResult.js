import {createAction} from 'redux-actions';
import {SALERESULT_CHANGE} from '../constants/ActionTypes';

let action_saleResult_change=createAction(SALERESULT_CHANGE);

export function saleResultChange(saleItem){
    return dispatch =>{
        dispatch(action_saleResult_change(saleItem));
    }
}