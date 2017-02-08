import {createAction} from 'redux-actions';

const NAME_CHANGE='NAME_CHANGE';

let action_name_change=createAction(NAME_CHANGE);

export function nameChange(userName){
    return dispatch=>{
        dispatch(action_name_change(userName));
    };
}