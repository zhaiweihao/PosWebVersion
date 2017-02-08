import {message as MessageBox} from '../common/message';
import * as Message from '../constants/Message';
import {arrayContains} from '../common/extend';

function couponCheck(checkInput){
    const nowDate=new Date();
    let coupon=checkInput.coupon;
    let total=checkInput.total;
    let prodList=checkInput.prodList;
    /*优惠券条件判断*/
    if(coupon.used){
        if(checkInput.isShowMsg){
            MessageBox('error',Message.MSG15,Message.MSG16);
        }
        return false;
    }
    if(nowDate>coupon.endDate){
        if(checkInput.isShowMsg){
            MessageBox('error',Message.MSG15,Message.MSG18);
        }
        return false;
    }
    if(nowDate<coupon.startDate){
        if(checkInput.isShowMsg){
            MessageBox('error',Message.MSG15,Message.MSG17);
        }
        return false;
    }
    if(total<coupon.minUsableAmount){
        if(checkInput.isShowMsg){
            MessageBox('error',Message.MSG15,Message.MSG19);
        }
        return false;
    }
    
    let couponStyle=coupon.usableStyles;
    if(couponStyle.length>0){
        let fit=false;
        prodList.forEach(function(prod){
            couponStyle.forEach(function(fitStyle){
                if(prod.styleCode===fitStyle){
                    fit=true;
                }
            });
        });
        if(!fit){
            if(checkInput.isShowMsg){
                MessageBox('error',Message.MSG15,Message.MSG19);
            }
            return false;
        }
    }
    return true;
}
function rateCalculate(calculateInput){
    var result=calculateInput.prodList;
    //var total=calculateInput.total;
    var discount=calculateInput.rate;
    var fitStyle=calculateInput.fitStyle;

    if(fitStyle.length<1){   
        result.forEach(function(item){
            item.discount=item.total*(1-discount);
            item.subTotal=item.total*discount;
        });
    }
    else{
        result.forEach(function(item){
            if(arrayContains(fitStyle,item.styleCode)){
                item.discount=item.total*(1-discount);
                item.subTotal=item.total*discount;
            }
        });
    }
    return {
        calculateItems:result.map(function(item){
            return {
                brandCode:item.brandCode,
                productCode:item.prodCode,
                total:item.total,
                subTotal:item.subTotal,
                discountAmount:item.discount
            }
        })
    }
}
function amountCalculate(calculateInput){
    var result=calculateInput.prodList;
    var total=calculateInput.total;
    var amount=calculateInput.amount;
    var fitStyle=calculateInput.fitStyle;

    if(fitStyle.length<1){   
        result.forEach(function(item){
            item.discount=amount*item.total/total;
            item.subTotal=item.total-amount*item.total/total;
        });
    }
    else{
        result.forEach(function(item){
            if(arrayContains(fitStyle,item.styleCode)){
                item.discount=amount*item.total/total;
                item.subTotal=item.total-amount*item.total/total;
            }
        });
    }
    return {
        calculateItems:result.map(function(item){
            return {
                brandCode:item.brandCode,
                productCode:item.prodCode,
                total:item.total,
                subTotal:item.subTotal,
                discountAmount:item.discount
            }
        })
    }
}
export function crmCaluculate(prodList,coupon,isShowMsg,successCallback,failureCallback){
    let total=0.00;
    prodList.forEach(function(item){
        total+=item.total;
    });
    if(!couponCheck({
        coupon:coupon,
        prodList:prodList,
        total:total,
        isShowMsg:isShowMsg,
        failure:failureCallback
    })){
        return ;
    }
    
    let discount=coupon.discount;
    let typeInfo=coupon.couponType;
    let fitStyle=coupon.usableStyles;
    if(typeInfo.couponTypeCode==="A"){
        return rateCalculate({
            rate:discount.rate,
            prodList:prodList,
            fitStyle:fitStyle,
            total:total
        });
    }
    if(typeInfo.couponTypeCode==="B"){
        return amountCalculate({
            amount:discount.amount,
            prodList:prodList,
            fitStyle:fitStyle,
            total:total
        });
    }
    return ;
    
    
}