import {CUSTOMER_CHANGE,CUSTOMER_REQUEST,CUSTOMER_ERROR,CUSTOMER_INIT
}from '../constants/ActionTypes';
import {createAction} from 'redux-actions';
import customer from '../apis/customer';
import {message  as MessageBox} from '../common/message';
import * as Message from '../constants/Message';

let action_customer_request=createAction(CUSTOMER_REQUEST);
let action_customer_change=createAction(CUSTOMER_CHANGE);
let action_customer_error=createAction(CUSTOMER_ERROR);
let action_customer_init=createAction(CUSTOMER_INIT);


export function getCustomer(brandCode, custNo, email, custName, cellNo, custCardNo,hideModal){
    return dispatch =>{
        dispatch(action_customer_request());
        customer.getCustomer(brandCode, custNo, email, custName, cellNo, custCardNo,
        (data)=>{
            console.log('获取customer成功');
            if(data.ResultInfoList.ResultInfo===undefined){
                dispatch(action_customer_error());
                MessageBox('error',Message.MSG03);
                return ;
            }
            if(Array.isArray(data.ResultInfoList.ResultInfo)){
                dispatch(action_customer_error());                
                MessageBox('error',Message.MSG03);
                return ;
            }
            const resultInfo=data.ResultInfoList.ResultInfo;
            const result={
                custNo:resultInfo.vipcode,
                cellNo:resultInfo.mobile,
                grade:resultInfo.grade,
                name:resultInfo.name,
                brandCode:resultInfo.brandCode,
                custCardNo:custCardNo
            }
            dispatch(action_customer_change(result));
            hideModal();
        },(error)=>{
                dispatch(action_customer_error());
                return;
        })
    }
}

export function initCustomer(){
    return dispatch=>{
        dispatch(action_customer_init());
    }
}
