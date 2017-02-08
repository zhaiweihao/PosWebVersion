import {COUPON_REQUEST,
        COUPON_SUCCESS,
        COUPON_FAILURE,
        COUPON_SET,
        COUPON_INIT
}from '../constants/ActionTypes';
import {createAction} from 'redux-actions';
import coupon from '../apis/coupon';
import {message as MessageBox} from '../common/message';
import {getShop} from '../common/shopUtil';
import {crmCaluculate} from '../service/crmDiscount';

let action_coupon_request=createAction(COUPON_REQUEST);
let action_coupon_success=createAction(COUPON_SUCCESS);
let action_coupon_failure=createAction(COUPON_FAILURE);
let action_coupon_set=createAction(COUPON_SET);
let action_coupon_init=createAction(COUPON_INIT);

export function initCoupon(){
    return dispatch=>{
        dispatch(action_coupon_init());
    }
}
function wcsCouponCalculate(couponContent,prodList,isReSale,isShowMsg,successCallback,failureCallback){
    let calculateItems=[];
    console.log("#1");
    calculateItems=prodList.map(function(prod){
        return {
            brandCode:prod.brandCode,
            productCode:prod.prodCode,
            styleCode:prod.styleCode,
            qty:prod.qty,
            price:prod.price,
            spotCode:getShop(prod.brandCode),
            itemCode:prod.itemCode
        };
    });
     console.log("#2"); 
    coupon.wcsCouponCalculate({
            couponNo:couponContent.couponNo,
            calculateItems:calculateItems,
            isReSale:isReSale,
            isShowMsg:isShowMsg
        },(data)=>{
            successCallback(data,{
                couponNo:couponContent.couponNo,
                discountName:data.discountName,
                couponType:data.couponType,
                partRefund:data.partRefund,
                eventId:data.eventId
            });
        },
        (title,detail)=>{
            failureCallback(title,detail);
            console.log('coupon action error');
            if(isShowMsg){
                MessageBox('error',title,detail);
            }
        })
}

function crmCouponCalculate(couponContent,prodList,isReSale,isShowMsg,successCallback,failureCallback){
        if(couponContent.couponType){
            const result=crmCaluculate(prodList,couponContent,isShowMsg);
            if(!result){
                failureCallback();
                return;
            }
            successCallback(result,couponContent);
            return;
        }
        let brandCode=prodList[0].brandCode;
        coupon.crmCouponSearch({
            UsableBrands:brandCode,
            CouponNo:couponContent.couponNo
        },(couponResult)=>{
            //现金券不可以部分退货 B
            //折扣券可以部分退货 A
            couponResult.partRefund=couponResult.couponType.couponTypeCode==="B"?true:false;
            const result=crmCaluculate(prodList,couponResult,isShowMsg);
            if(!result){
                failureCallback();
                return;
            }
            successCallback(result,couponResult);
        },(title,detail)=>{
            MessageBox('error',title,detail);
            failureCallback();
        })
}

export function calculate(couponContent,prodList,isReSale,isShowMsg,successCallback,failureCallback){
    return dispatch=>{
        //dispatch(action_coupon_request());
        if(couponContent.couponNo.length===18){
            wcsCouponCalculate(couponContent,prodList,isReSale,isShowMsg,
                (data,couponResult)=>{
                    successCallback(data);
                    dispatch(action_coupon_success(couponResult));
                },
                ()=>{
                    failureCallback();
                    //dispatch(action_coupon_failure());
                });
        }
        if(couponContent.couponNo.length===12){
            crmCouponCalculate(couponContent,prodList,isReSale,isShowMsg,
            (data,couponResult)=>{
                successCallback(data);
                dispatch(action_coupon_success(couponResult));
            },
            ()=>{
                failureCallback();
                //dispatch(action_coupon_failure());
            })
        }
    }
}

