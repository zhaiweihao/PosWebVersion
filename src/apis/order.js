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
    orderSave:(order,successCallback,failureCallback)=>{
        const headers=getRequestHeader();
        axios.post(`${urls.order}MSI_Sale/OrderSave`,order,{headers:headers})
             .then(function (response){
                 console.log('保存成功');
                 successCallback();
             })
             .catch(function (error){
                 console.log('保存失败');
                 failureCallback(error.message);
             })
    }
    ,maxOrderNo:(terminalName,orderDate,storeGroupCode,storeCode,successCallback,failureCallback)=>{
        const headers=getRequestHeader();
        axios.get(`${urls.order}MSI_Sale/MaxOrderNo`,{
            params:{
                terminalName:terminalName,
                orderDate:orderDate,
                storeGroupCode:storeGroupCode,
                storeCode:storeCode
            }
        },{headers:headers})
        .then(function(response){
            successCallback(response.data);
        }).catch(function (error){
            console.log(error.message);
            failureCallback('保存失败',error.message);
        })
    }
    ,orderQuery:(orderNo,successCallback,failureCallback)=>{
        const headers=getRequestHeader();
        axios.get(`${urls.order}MSI_Sale/OrderQuery`,{
            params:{
                orderNo:orderNo
            }
        },{headers:headers})
        .then(function(response){
            successCallback(response.data);
        })
        .catch(function(error){
            failureCallback(error);
        })
    }
    ,maxNo:(queryInput,successCallback,failureCallback)=>{
        const brandCodes=queryInput.brandCodes;
        var queryArray=[];
        for(var i=0;i<brandCodes.length;i++){
            queryArray.push(getMaxNo({
                terminalName:queryInput.posNo,
                orderDate:queryInput.orderDate,
                storeGroupCode:brandCodes[i],
                storeCode:getShop(brandCodes[i])
            }))
        }
        //queryArray.push(getMaxNo());  
        axios.all(queryArray)
        .then(values=>{
            var seqNoArray=values.map(function(item){
                return item.data;
            })
            var result=[];
            for(var i=0;i<brandCodes.length;i++){
                result.push({
                    brandCode:brandCodes[i],
                    seqNo:seqNoArray[i]
                })
            }
            successCallback(result);
        }
        )
        .catch(function (error){
            console.log(error.message);
            failureCallback('保存失败',error.message);
        });
    }
}
