import axios from 'axios';
import {urls}from '../configs';
import {getRequestHeader} from '../common/request';
import * as Message from '../constants/Message';

export default {
    wcsCouponCalculate:(calculateInput,successCallback,failureCallback)=>{
        const headers=getRequestHeader();
        axios.post(`${urls.wcsCouponCalculate}discount/calculate`,calculateInput,{"headers":headers})
        .then(function (response){
            if(!response.data.success){
                console.log('coupon api error')
                failureCallback(Message.MSG15,response.data.error.Details);
                return;
            }
            console.log('coupon api success');
            successCallback(response.data.result);
        })
        .catch(function (error){
            console.log('coupon api error catch')
            failureCallback(Message.MSG15,error.message);
        })
    },
    wcsCouponUpdate:(updateInput,successCallback,failureCallback)=>{
        const headers=getRequestHeader();
        axios.put(`${urls.wcsCoupon}Coupon/${updateInput.couponNo}`
            ,updateInput
            ,{headers:headers})
            .then(function(response){
                console.log('wcs coupon update success');
                successCallback();
            })
            .catch(function(error){
                console.log('wcs coupon update error');
                failureCallback(Message.MSG15,error.message);
            })

    },
    crmCouponSearch:(queryInput,successCallback,failureCallback)=>{
        const headers=getRequestHeader();
        axios.get(`${urls.crmCoupon}CouponContents`
                ,{params:queryInput}
                ,{headers:headers})
            .then(function (response){
                if(response.data.length<1){
                    failureCallback(Message.MSG03,'');
                    return;
                }
                successCallback(response.data[0]);
            })
            .catch(function (error){
                failureCallback(Message.MSG15,error.message);
            })
    },
    crmCouponUpdate:(updateInput,successCallback,failureCallback)=>{
        const headers=getRequestHeader();
        axios.post(`${urls.product}?couponId=${updateInput.couponId}`,
            {
                SalesNo:updateInput.saleNo,
	            Used:updateInput.used,
	            UsedPlaceCode:updateInput.usedPlaceCode
            },
            {headers:headers})
            .then(function(response){
                console.log('crm coupon update success');
                successCallback();
            })
            .catch(function(error){
                console.log('crm coupon update error');
                failureCallback(Message.MSG15,error.message);
            })
    }
}