import * as mathExtend from '../common/math';
import {getAccount} from '../common/request';
import {toYYYYYMMDD} from '../common/date';
import * as PaymentMethod from '../constants/PaymentMethod';
import orders from '../apis/order';

import {ORDER_SAVE_SUCCESS,ORDER_SAVE_REQUEST,ORDER_SAVE_ERROR} from '../constants/ActionTypes';
import {createAction} from 'redux-actions';
import {message as MessageBox} from '../common/message';
import * as Message from '../constants/Message';
import {arrayUnique} from '../common/extend';
import {getShop} from '../common/shopUtil';
import couponApi from '../apis/coupon';

let action_order_save_success=createAction(ORDER_SAVE_SUCCESS);
let action_order_save_request=createAction(ORDER_SAVE_REQUEST);
let action_order_save_error=createAction(ORDER_SAVE_ERROR);

function createOrderId(){
   // while(true){
        const guid=mathExtend.newGuid();
    //    orders.orderQuery(guid,
    //    (data)=>{
    //        if(!data){
     //           orderId=guid;
                return guid;
    //        }
     //   },
     //   ()=>{});
  //  }
}

function createOrderNo(saleItems,salePayment,saleResult,salesman,customer,coupon,origOrder,success,failure){
    //var seqno='';
    const orderDate=toYYYYYMMDD(new Date());
    const account=getAccount();
    const posNo=account.posNo;
    var brands=saleItems.map(function(item){
        return item.brandCode;
    })
    const brandCodes=arrayUnique(brands);
    orders.maxNo({
        brandCodes:brandCodes,
        posNo:posNo,
        orderDate:orderDate
    },
    (data)=>{
        var orderNos=data.map(function(item){
            return {
                brandCode:item.brandCode,
                shopCode:getShop(item.brandCode),
                orderNo:item.brandCode+0+getShop(item.brandCode)+orderDate.substring(2,8)+mathExtend.pad(posNo,2)+mathExtend.pad((item.seqNo+1),4)
            };
        });
        createOrder(saleItems,salePayment,saleResult,salesman,customer,coupon,origOrder,orderNos,success,failure);
    },(title,msg)=>{
        MessageBox('error',title,msg);
    });
}

function createOrderItem(orderId,orderNo,saleItems,brandCode){
    var result=[];
    for(var i=0;i<saleItems.length;i++){
        if(saleItems[i].brandCode===brandCode){
        result.push({
            id:mathExtend.newGuid(),
            orderId:orderId, //需要先获取orderId
            orderNo:orderNo, //需要先获取orderNo
            brandCode:brandCode,
            orderItemSeqNo:i+1,
            productId:saleItems[i].prodCode,
            quantity:saleItems[i].qty,
            unitPrice:saleItems[i].price,
            enteredPrice:saleItems[i].price,
            total:saleItems[i].total,
            subTotal:saleItems[i].subTotal,
            totalDiscountAmt:saleItems[i].discount
        })
        }
    }
    return result;
}

function createOrderPayment(orderId,orderNo,salePayment,brandCode,orderType,rate){
    var result=[];
    var seqNo=1;
    if(salePayment.cashPaid!==0.00){
        result.push({
            id:mathExtend.newGuid(),
            orderId:orderId,
            orderNo:orderNo,
            orderPaymentSeqNo:seqNo,
            recvAmt:salePayment.cashPaid*rate.fitSubTotalRate,
            orderPayType:0,
            changeAmt:0,
            payAmt:salePayment.cashPaid*rate.fitSubTotalRate,
            paymentType:0,
            payName:paymentName(PaymentMethod.CASH),
            cardNo:null,
            cardType:null,
            cardApprovalTime:null, //这个是初始时间
            cardSerialNo:null,
            cardTerminalNo:null,
            transNo:null
        });
        seqNo+=1;
    }
    if(salePayment.mainlandCardPaid!==0.00){
        result.push({
            id:mathExtend.newGuid(),
            orderId:orderId,
            orderNo:orderNo,
            orderPaymentSeqNo:seqNo,
            recvAmt:salePayment.mainlandCardPaid*rate.fitSubTotalRate,
            orderPayType:0,
            changeAmt:0,
            payAmt:salePayment.mainlandCardPaid*rate.fitSubTotalRate,
            paymentType:0,
            payName:paymentName(PaymentMethod.MAINLAND_CARD),
            cardNo:null,
            cardType:null,
            cardApprovalTime:null, //这个是初始时间
            cardSerialNo:null,
            cardTerminalNo:null,
            transNo:null
        });
        seqNo+=1;
    }
    if(salePayment.aboradCardPaid!==0.00){
        result.push({
            id:mathExtend.newGuid(),
            orderId:orderId,
            orderNo:orderNo,
            orderPaymentSeqNo:3,
            recvAmt:salePayment.aboradCardPaid*rate.fitSubTotalRate,
            orderPayType:0,
            changeAmt:0,
            payAmt:salePayment.aboradCardPaid*rate.fitSubTotalRate,
            paymentType:0,
            payName:paymentName(PaymentMethod.ABROAD_CARD),
            cardNo:null,
            cardType:null,
            cardApprovalTime:null, //这个是初始时间
            cardSerialNo:null,
            cardTerminalNo:null,
            transNo:null
        });
        seqNo+=1;
    }
    
    return result;
}

function orderRate(saleItems,brandCode){
    var total=0.00;
    var subTotal=0.00;

    var fitTotal=0.00;
    var fitSubTotal=0.00;
    var fitQty=0;

    saleItems.forEach(function(item){
        total+=item.total;
        subTotal+=item.subTotal;
        if(item.brandCode===brandCode){
            fitTotal+=item.total;
            fitSubTotal+=item.subTotal;
            fitQty+=item.qty;
        }
    })
    return {
        fitQty:fitQty,
        fitTotalRate:fitTotal/total,
        fitSubTotalRate:fitSubTotal/subTotal
    };
}

function paymentName(paymentMethod){
    switch(paymentMethod){
        case PaymentMethod.CASH:
        return '现金';
        case PaymentMethod.MAINLAND_CARD:
        return '国内卡';
        case PaymentMethod.ABROAD_CARD:
        return '国外卡';
        default:
        return undefined;
    }
}

function createOrderCoupon(coupon,orderId,brandCode,saleResult,rate){
    if(!coupon){
        return null;
    }
    let result=[];
    console.log(saleResult);
    console.log(rate);
    result.push({
        id:mathExtend.newGuid(),
        orderId:orderId,
        couponNo:coupon.couponNo,
        benefitValue:(saleResult.discount*rate.fitSubTotalRate).toString(),
        couponId:coupon.id,
        useChk:false,
        brandCode:brandCode,
        couponType:coupon.id?coupon.couponType.couponTypeCode:coupon.couponType,
        eventId:coupon.eventId||null,
        discount:coupon.id?coupon.discount.rate:null
    });
    return result;
}

function couponUpdate(updateInput,successCallback,failureCallback){
    const account=getAccount();
    const orderNos=updateInput.orderNos.map(function(item){
        return item.orderNo;
    });
    const brandCodes=updateInput.orderNos.map(function(item){
        return item.brandCode;
    })
    if(updateInput.coupon.couponNo.length===18){
        couponApi.wcsCouponUpdate({
            couponNo:updateInput.coupon.couponNo,
            saleNo:orderNos,
	        useChk:true,
	        shopCode:account.shopCode,
	        useBrandCode:brandCodes,
	        useCustNo:updateInput.custNo
        },()=>{
            successCallback();
        },(title,detail)=>{
            failureCallback(title,detail);
        })
    }

    if(updateInput.coupon.couponNo.length!==18){
        couponApi.crmCouponUpdate({
            couponId:updateInput.coupon.id,
            saleNo:orderNos,
	        used:true,
	        usedPlaceCode:account.shopCode
        },()=>{
            successCallback()
        },(title,detail)=>{
            failureCallback(title,detail);
        })
    }
}

function createOrder(saleItems,salePayment,saleResult,salesman,customer,coupon,origOrder,orderNos,successCallback,failureCallback){
    var orderResult=[];
    const orderDate=toYYYYYMMDD(new Date());
    const account=getAccount();
    const posNo=account.posNo;

    orderNos.forEach(function(item){
    const orderId=createOrderId();
    const rate=orderRate(saleItems,item.brandCode);
    const order= {
        id:orderId,
        orderNo:item.orderNo,
        orderType: saleResult.orderType,
        storeGroupCode:item.brandCode,
        storeCode:item.shopCode,
        total:saleResult.total*rate.fitTotalRate,
        subTotal:saleResult.subTotal*rate.fitSubTotalRate,
        quantity:rate.fitQty,
        terminalName:posNo,
        cashierName: salesman.cashierName,
        custName: customer===undefined?null:customer.name,
        custNo: customer===undefined?null:customer.custNo,
        savedMileage: 0,
        usedMileage: 0,
        status: 30,
        orderDate: orderDate,
        origOrderID: origOrder===undefined?null:origOrder.origOrderID,
        isReturn: saleResult.orderType==='N'?false:true,
        totalDiscountAmt: saleResult.discount*rate.fitTotalRate,
        storeReceiptNo: salesman.storeReceiptNo,
        partRefundable:true,//
        isReSale:saleResult.orderType==='A'?true:false,
        custBrandCode:customer===undefined?null:customer.brandCode,
        items:createOrderItem(orderId,item.orderNo,saleItems,item.brandCode),
        orderPayments:createOrderPayment(orderId,item.orderNo,salePayment,item.brandCode,saleResult.orderType,rate),
        orderCoupons:createOrderCoupon(coupon,orderId,item.brandCode,saleResult,rate)
        };
        orderResult.push(order);
    });
    orders.orderSave(orderResult,success=>{
            //dispatch(action_order_save_success());
            if(coupon){
            couponUpdate({
                coupon:coupon,
                orderNos:orderNos,
                custNo:customer.custNo
            },()=>{
                MessageBox('success','保存成功');
            if(successCallback){
                successCallback();
                failureCallback();
            }
            },(title,detail)=>{
                MessageBox('error',title,detail);
            if(failureCallback){
                failureCallback();
            }
        }
        )
            }
            else{
                MessageBox('success','保存成功');
                if(successCallback){
                successCallback();
                failureCallback();
            }
            }
        },
        (title,msg)=>{
            const error={
                title:title,    
                message:msg
            };
            MessageBox('error',error.title,error.message);
            if(failureCallback){
                failureCallback();
            }
            //dispatch(action_order_save_error(error));
        })
}

function createOrders(saleItems,salePayment,saleResult,salesman,customer,coupon,origOrder,success,failure){
     createOrderNo(saleItems,salePayment,saleResult,salesman,customer,coupon,origOrder,success,failure);
}

function checkOrder(saleItem,salePay,salesman,saleResult){
    if(saleItem===undefined||saleItem.length<1){
        MessageBox('error','',Message.MSG06);
        return false;
    }
    if(((saleResult.subTotal||0.00)-((salePay.cashPaid||0.00)+(salePay.mainlandCardPaid||0.00)+(salePay.aboradCardPaid||0.00)))>0){
        MessageBox('error','',Message.MSG09);
        return false;
    }
    if(salesman.storeReceiptNo===undefined||salesman.storeReceiptNo.trim()===''){
        MessageBox('error','',Message.MSG10);
        return false;
    }
    if(salesman.cashierName===undefined||salesman.cashierName.trim()===''){
        MessageBox('error','',Message.MSG11);
        return false;
    }
    return true;
}

export function orderSave(saleItem,saleResult,salePayment,salesman,customer,coupon,origOrder,success,failure){
    return dispatch=>{
        if(!checkOrder(saleItem,salePayment,salesman,saleResult)){
            if(failure){
                failure();
            }
            return;
        }
        dispatch(action_order_save_request());
        //var account=getAccount();
        createOrders(saleItem,salePayment,saleResult,salesman,customer,coupon,origOrder,
        success,failure);
    }
}