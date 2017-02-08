import axios from 'axios';
import {urls}from '../configs';
import {getRequestHeader} from '../common/request';

export default {
    /*
    {
        currentBrandCode=currentBrandCode,
        prodcode=this.state.searchText,
        success:function(){},
        failure:function(){},
        error:function(){}
    }
     */
    getList:function(requestData){
        const headers=getRequestHeader();
        axios.get(`${urls.product}`,{
            params:{
                brandcode:requestData.currentBrandCode,
                prodcode:requestData.prodcode
            }
        },
        {headers:headers})
        .then(function (responseData){
            console.log("product api response data:"+JSON.stringify(responseData));
            if(Array.isArray(responseData.data)){
                console.log('product api success')
                requestData.success(responseData.data);
                return;
            }
            console.log('product api failure');
            requestData.failure(requestData.data.result);
            return;
        })
        .catch(function (error){
            console.log('product api error catch')
            requestData.error(error);
        })
    }
}