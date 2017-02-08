import {getAccount} from './request';
export function getShop(brandCode){
    var account=getAccount();
    var result;
    account.shopInfos.forEach(function(shop){
        if(brandCode===shop.brandCode){
            result=shop.shopCode;
        }
    });
    return result;
}