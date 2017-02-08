import {createAction} from 'redux-actions';
import {SALESMAN_CHANGE} from '../constants/ActionTypes';

let action_salesman_change=createAction(SALESMAN_CHANGE);

export function salesmanChange(salesman){
    return dispatch =>{
        dispatch(action_salesman_change(salesman));
    }
}
