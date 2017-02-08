import axios from 'axios';
import {urls}from '../configs';
import {getRequestHeader} from '../common/request';
import {getShop} from '../common/shopUtil';

function getMaxNo(queryInput){
    const headers=getRequestHeader();
    return axios.get(`${urls.order}MSI_Sale/MaxOrderNo`,{
            params:{
                terminalName:queryInput.terminalName,
                orderDate:queryInput.orderDate,
                storeGroupCode:queryInput.storeGroupCode,
                storeCode:queryInput.storeCode
            }
    },{headers:headers});
}

export default {
    crmCouponUpdate:(updateInput,successCallback,failureCallback)=>{
        const headers=getRequestHeader();
        axios.patch(`${urls.crmCoupon}CouponContents/${updateInput.couponId}`,
            updateInput,
            {headers:headers})
            .then(function(response){
                console.log('crm coupon update success');
                successCallback();
            })
            .catch(function(error){
                console.log('crm coupon update error');
                failureCallback("CRM优惠券更新错误",error.message);
            })
    }
}