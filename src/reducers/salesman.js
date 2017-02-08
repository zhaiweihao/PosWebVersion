import {handleActions} from 'redux-actions';
import {getAccount} from '../common/request';

const salesmanReducer=handleActions({
    SALESMAN_CHANGE:(state,action)=>{
        const salesman=action.payload;
        return {
            cashierName:salesman.cashierName?salesman.cashierName:getAccount().userId,
            storeReceiptNo:salesman.storeReceiptNo
        };
    }
},{});

export default salesmanReducer;