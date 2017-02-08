import { handleActions } from 'redux-actions';

const saleItemReducer = handleActions({
    ITEM_CHANGE: (state, action) => {
        const item=action.payload;
        console.log("ITEM_CHANGE"+JSON.stringify(item));
        return {
             status: action.type,
             item:item,
             isLoading:state.isLoading
            };
    },
    ITEM_SET_LOADING: (state, action) => {
        const value=action.payload;
        console.log("loading state : "+value);
        return {
             status: action.type,
             item:state.item,
             isLoading:value
            };
    }
}, {});

export default saleItemReducer;