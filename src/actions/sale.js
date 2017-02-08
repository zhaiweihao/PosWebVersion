import {createAction} from 'redux-actions';

const PRD_SEARCH='PRD_SEARCH';

let prd_search_action = createAction(PRD_SEARCH);

export function setResult(results){
    console.log('###in setResult action :'+results);
    return dispatch=> dispatch(prd_search_action(results));
}