/*
state:{
    <!--登陆页面-->
    account:{
        status:LOGIN_SUCCESS
        error: {
            title:'',
            message:''
        }
        data:{
            "userId": "Shop-6001000000",
            "userName": "陈倩",
            "empId": "6001000000",
            "posNo": 0,
            "brandCode": "KS",
            "shopCode": "C9L8",
            "error": false,
            "errorMessage": null,
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOjAsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vYWNjZXNzY29udHJvbHNlcnZpY2UvMjAxMC8wNy9jbGFpbXMvaWRlbnRpdHlwcm92aWRlciI6IkFTUC5ORVQgSWRlbnRpdHkiLCJ1bmlxdWVfbmFtZSI6IlNob3AtNjAwMTAwMDAwMCIsInJvbGUiOiJTcG90IiwiaHR0cDovL3d3dy5hc3BuZXRib2lsZXJwbGF0ZS5jb20vaWRlbnRpdHkvY2xhaW1zL3RlbmFudElkIjoiMSIsImV4cCI6IjE0ODQzNzM2NjIiLCJpc3MiOiJTaG9wLTYwMDEwMDAwMDAiLCJpYXQiOiIxNDg0MTE0NDYyIiwibmJmIjoiMTQ4NDExNDQ2MiJ9.c75HWzdUrfoOf3fOc3HhoBtcF2pghsWYyad1K7A77BM",
            "isComplex": false,
            "shopInfos": [
                {
                    "brandCode": "KS",
                    "shopCode": "C9L8",
                    "isChief": false
                }
            ],
            "date": null
        }
    }
    <!--销售页面-->
    saleItem:{
        status:SALE //RETURN
        item:[
            {
                prodCode:"WAAB9045001",
                price:100.00,
                qty:1,
                disocunt:0.2,
                subTotal:80,
                brandCode:"EE",
                total:100,
                itemCode:"AB"
            },
            {
                prodCode:"WAAB9045002",
                price:100.00,
                qty:2,
                disocunt:0.2,
                subTotal:160,
                brandCode:"EE",
                total:100,
                itemCode:"AB"
            }
        ]
    }
    saleResult:{
        orderType:SALE, //RETURN
        qty:2,
        total:300.00,
        disocunt:60.00,
        subTotal:240
    }
    payment:{
        status:SALE,//RETURN
        item:{
                {
                    type:CASH,
                    recvAmt:100.00,
                    changeAmt:1.00;
                    paidAmt:99.00
                }
            ],
            toBePaidAmt:0.00
        }
    }
    salesman:{
        cashierName:'',
        storeReceiptNo:''
    }
    customer:{
        data:{
            custname:''
            custNo:'',
            brandCode:''
        }
    }
    originOrder{
        origOrderID:''
    }
    
}
*/
import userTestReducer from './userTest';
import saleItemReducer from './saleItem';
import saleResultReducer from './saleResult';
import { combineReducers } from 'redux';
import accountReducer from './account';
import saleReducer from './saleReducer';
import salePaymentReducer from './salePayment';
import salesmanReducer from './salesman';
import orderReducer from './order';
import customerReducer from './customer';
import couponReducer from './coupon';
{/*import userTestReducer from './userTest'; */}

export default combineReducers({
    account: accountReducer,
    userTest:userTestReducer,
    saleItem:saleItemReducer,
    saleResult:saleResultReducer,
    salePayment:salePaymentReducer,
    order:orderReducer,
    salePay:salePaymentReducer,
    salesman:salesmanReducer,
    customer:customerReducer,
    coupon:couponReducer
});