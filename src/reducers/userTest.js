import {handleActions } from 'redux-actions';

const userTestReducer=handleActions({
    NAME_CHANGE:(state,action)=>{
        return {
            Name:action.payload
        };
    }
},{});

export default userTestReducer;