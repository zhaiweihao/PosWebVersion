import {SALE_NORMAL,SALE_RETURN,ITEM_CHANGE,ITEM_SET_LOADING}from '../constants/ActionTypes';
import {createAction} from 'redux-actions';
import {calculate} from './coupon.js';

let action_saleItem_change=createAction(ITEM_CHANGE);
let action_saleItem_setLoading=createAction(ITEM_SET_LOADING);

export function itemChange(item){
        return (dispatch,getState)=>{
            /*let stateRoot = getState();
            if(stateRoot.coupon.couponNo){
                console.log("this state is :"+JSON.stringify(getState()));
                stateRoot.saleItem.isLoading=true;
                calculate(stateRoot.coupon.couponNo,item,false,function(responseData){
                    sleep(2000);
                    dispatch(action_saleItem_change(responseData.calculateItems));
                    stateRoot.saleItem.isLoading=false;
                },function(errorMsg){
                    console.log("request coupon failure:"+JSON.stringify(errorMsg));
                    stateRoot.saleItem.isLoading=false;
                });
                return;
            }*/
            dispatch(action_saleItem_change(item));
        };
}

export function setLoading(value){
        return dispatch=>{
            console.log("action setloading :"+value);
            dispatch(action_saleItem_setLoading(value));
        };
}

  function  sleep(numberMillis) {
　　var now = new Date();
　　var exitTime = now.getTime() + numberMillis;
　　while (true) {
　　now = new Date();
　　if (now.getTime() > exitTime)
　　return;
　　}
　　}

